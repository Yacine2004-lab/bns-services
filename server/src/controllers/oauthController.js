import crypto from 'crypto'
import { prisma } from '../config/prisma.js'
import { generateCustomerToken } from '../utils/jwt.js'

// URLs de redirection vers le frontend
const CLIENT_URL = process.env.CLIENT_URL || 'https://bns-nine.vercel.app'

// Whitelist des callback URLs autorisees (protection contre les redirections malveillantes)
const ALLOWED_CALLBACK_HOSTS = new Set([
  'bns-api-production.up.railway.app',
  'localhost',
  '127.0.0.1',
])

/**
 * Verifie que le host de la requete est dans la whitelist
 */
function isAllowedHost(host) {
  if (!host) return false
  const hostname = host.split(':')[0]
  return ALLOWED_CALLBACK_HOSTS.has(hostname)
}

/**
 * Initie le flux OAuth en redirigeant l'utilisateur vers le provider.
 * Le frontend appelle cette route et est redirige vers Google/Facebook.
 */
export function oauthRedirect(provider) {
  return (req, res) => {
    // Valider le host de la requete
    if (!isAllowedHost(req.get('host'))) {
      return res.status(403).json({ success: false, message: 'Host non autorise.' })
    }

    const callbackUrl = `${req.protocol}://${req.get('host')}/api/auth/${provider}/callback`

    // Generer un state token CSRF (valide 10 minutes)
    const state = crypto.randomBytes(32).toString('hex')
    const stateExpiry = Date.now() + 600000 // 10 min

    // Stocker le state en session (cookie httpOnly)
    res.cookie(`oauth_state_${provider}`, `${state}:${stateExpiry}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600000, // 10 min
    })

    if (provider === 'google') {
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account',
        state,
      })
      return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
    }

    if (provider === 'facebook') {
      const params = new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: 'email,public_profile',
        state,
      })
      return res.redirect(`https://www.facebook.com/v18.0/dialog/oauth?${params}`)
    }

    res.status(400).json({ success: false, message: 'Provider non supporte.' })
  }
}

/**
 * Gere le callback OAuth : echange le code contre un token,
 * recupere les infos utilisateur, cree/trouve le compte, retourne un JWT.
 */
export function oauthCallback(provider) {
  return async (req, res) => {
    try {
      const { code, state } = req.query

      // Valider le state CSRF
      const cookieName = `oauth_state_${provider}`
      const storedState = req.cookies?.[cookieName]

      if (!state || !storedState) {
        return res.redirect(`${CLIENT_URL}/connexion?error=oauth_invalid_state`)
      }

      const [expectedState, expiry] = storedState.split(':')
      if (state !== expectedState || Date.now() > parseInt(expiry)) {
        return res.redirect(`${CLIENT_URL}/connexion?error=oauth_state_expired`)
      }

      // Supprimer le cookie state (one-time use)
      res.clearCookie(cookieName)

      if (!code) {
        return res.redirect(`${CLIENT_URL}/connexion?error=oauth_denied`)
      }

      // Valider le host
      if (!isAllowedHost(req.get('host'))) {
        return res.redirect(`${CLIENT_URL}/connexion?error=oauth_invalid_host`)
      }

      const callbackUrl = `${req.protocol}://${req.get('host')}/api/auth/${provider}/callback`
      let userInfo = null

      if (provider === 'google') {
        // Echanger le code contre un token d'acces
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: callbackUrl,
            grant_type: 'authorization_code',
          }),
        })
        const tokenData = await tokenRes.json()
        if (!tokenData.access_token) {
          return res.redirect(`${CLIENT_URL}/connexion?error=oauth_failed`)
        }

        // Recuperer les infos utilisateur
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })
        const googleUser = await userRes.json()

        userInfo = {
          email: googleUser.email,
          firstName: googleUser.given_name || googleUser.name?.split(' ')[0] || '',
          lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '',
          providerId: googleUser.id,
        }
      }

      if (provider === 'facebook') {
        // Echanger le code contre un token d'acces (Facebook utilise les query params)
        const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`
        const tokenRes = await fetch(tokenUrl)
        const tokenData = await tokenRes.json()
        if (!tokenData.access_token) {
          return res.redirect(`${CLIENT_URL}/connexion?error=oauth_failed`)
        }

        // Recuperer les infos utilisateur
        const userRes = await fetch(
          `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokenData.access_token}`
        )
        const fbUser = await userRes.json()

        const nameParts = (fbUser.name || '').split(' ')
        userInfo = {
          email: fbUser.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          providerId: fbUser.id,
        }
      }

      if (!userInfo || !userInfo.email) {
        return res.redirect(`${CLIENT_URL}/connexion?error=oauth_failed`)
      }

      const cleanEmail = userInfo.email.toLowerCase()

      // Chercher un compte existant
      let customer = await prisma.customer.findUnique({
        where: { email: cleanEmail },
      })

      if (customer) {
        // Mettre a jour les infos provider si necessaire
        if (!customer.provider || customer.provider !== provider) {
          customer = await prisma.customer.update({
            where: { id: customer.id },
            data: { provider, providerId: userInfo.providerId },
          })
        }
      } else {
        // Creer un nouveau compte
        customer = await prisma.customer.create({
          data: {
            email: cleanEmail,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            provider,
            providerId: userInfo.providerId,
            password: null, // Pas de mot de passe pour les comptes OAuth
          },
        })
      }

      // Generer le token JWT
      const token = generateCustomerToken(customer)

      // Rediriger vers le frontend avec le token
      res.redirect(`${CLIENT_URL}/connexion?oauth_success=1&token=${token}`)
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error.message)
      res.redirect(`${CLIENT_URL}/connexion?error=oauth_failed`)
    }
  }
}
