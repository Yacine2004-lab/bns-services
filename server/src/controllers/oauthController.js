import { prisma } from '../config/prisma.js'
import { generateCustomerToken } from '../utils/jwt.js'

// URLs de redirection vers le frontend
const CLIENT_URL = process.env.CLIENT_URL || 'https://bns-nine.vercel.app'

/**
 * Initie le flux OAuth en redirigeant l'utilisateur vers le provider.
 * Le frontend appelle cette route et est redirige vers Google/Facebook.
 */
export function oauthRedirect(provider) {
  return (req, res) => {
    const callbackUrl = `${req.protocol}://${req.get('host')}/api/auth/${provider}/callback`

    if (provider === 'google') {
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account',
      })
      return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
    }

    if (provider === 'facebook') {
      const params = new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: 'email,public_profile',
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
      const { code } = req.query
      if (!code) {
        return res.redirect(`${CLIENT_URL}/connexion?error=oauth_denied`)
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
        userInfo = await userRes.json()

        userInfo = {
          email: userInfo.email,
          firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || '',
          lastName: userInfo.family_name || userInfo.name?.split(' ').slice(1).join(' ') || '',
          providerId: userInfo.id,
        }
      }

      if (provider === 'facebook') {
        // Echanger le code contre un token d'acces
        const tokenRes = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        // Facebook utilise des query params pour cette requete
        const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`
        const tokenRes2 = await fetch(tokenUrl)
        const tokenData = await tokenRes2.json()
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
