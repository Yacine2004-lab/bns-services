import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

// Transporteur email — créé au premier envoi
let transporter = null
let etherealCredentials = null

/**
 * Initialiser le transporteur email.
 * En production : utilise le SMTP configuré dans .env
 * En développement : crée un compte Ethereal automatiquement
 */
export async function initMailer() {
  if (env.smtpHost) {
    // SMTP réel (production)
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort || 587,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    })
    console.log(`📧 Email configuré via SMTP : ${env.smtpHost}:${env.smtpPort}`)
  } else if (env.nodeEnv !== 'production') {
    // Développement : créer un compte Ethereal de test
    try {
      const testAccount = await nodemailer.createTestAccount()
      etherealCredentials = {
        user: testAccount.user,
        pass: testAccount.pass,
      }
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: etherealCredentials,
      })
      console.log('📧 Email de test Ethereal configuré (les emails sont visibles via les liens de preview)')
    } catch (err) {
      console.warn('⚠️ Impossible de créer un compte Ethereal. Les emails ne seront pas envoyés en dev.')
      console.warn('   Configurez SMTP_HOST, SMTP_USER, SMTP_PASS dans .env pour la production.')
    }
  }
}

function getTransporter() {
  if (!transporter) {
    throw new Error("Le service email n'est pas initialisé. Appelez initMailer() au démarrage.")
  }
  return transporter
}

/**
 * Envoyer un email de réinitialisation de mot de passe
 * @param {string} to - Adresse email du destinataire
 * @param {string} resetToken - Token de réinitialisation
 * @param {'client'|'admin'} role - Rôle (détermine l'URL de reset)
 */
export async function sendPasswordResetEmail(to, resetToken, role = 'client') {
  const transport = getTransporter()

  const rawBaseUrl = env.clientUrl || ''
  // Si l'URL client est une adresse locale, utiliser l'URL de production
  const isLocal = rawBaseUrl.includes('192.168.') || rawBaseUrl.includes('localhost') || rawBaseUrl.includes('127.0.0.1')
  const baseUrl = (isLocal || !rawBaseUrl) ? 'https://bns-nine.vercel.app' : rawBaseUrl
  const resetPath = role === 'admin'
    ? `/admin/reinitialiser-mot-de-passe?token=${resetToken}`
    : `/reinitialiser-mot-de-passe?token=${resetToken}`
  const resetUrl = `${baseUrl}${resetPath}`

  const roleLabel = role === 'admin' ? 'administrateur' : 'client'
  const brandName = 'BNS Services'

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <tr>
      <td style="background:linear-gradient(135deg,#0B1F3A,#122a4a);padding:30px 40px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">${brandName}</h1>
        <p style="color:#f5a623;margin:6px 0 0;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Espace ${role === 'admin' ? 'Administrateur' : 'Client'}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:35px 40px;">
        <h2 style="color:#0B1F3A;margin:0 0 12px;font-size:20px;font-weight:700;">Réinitialisation de votre mot de passe</h2>
        <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 20px;">
          Bonjour,<br><br>
          Vous avez demandé la réinitialisation de votre mot de passe ${roleLabel} sur ${brandName}.
          Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding:10px 0;">
              <a href="${resetUrl}" style="display:inline-block;background:#f5a623;color:#0B1F3A;font-weight:700;font-size:15px;text-decoration:none;padding:14px 40px;border-radius:10px;">
                Réinitialiser mon mot de passe
              </a>
            </td>
          </tr>
        </table>
        <p style="color:#888;font-size:12px;line-height:1.6;margin:20px 0 0;">
          Ce lien est valable <strong>1 heure</strong>. Passé ce délai, vous devrez faire une nouvelle demande.<br>
          Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#999;font-size:11px;margin:0;">
          &copy; ${new Date().getFullYear()} ${brandName} — Dakar, Sénégal<br>
          Cet email a été envoyé automatiquement.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

  const mailOptions = {
    from: `"${brandName}" <yacinesall262@gmail.com>`,
    to,
    subject: `${brandName} — Réinitialisation de votre mot de passe`,
    text: `Réinitialisation de votre mot de passe ${brandName}\n\nCliquez sur ce lien pour réinitialiser votre mot de passe (valable 1 heure) :\n${resetUrl}\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`,
    html: htmlContent,
  }

  const info = await transport.sendMail(mailOptions)

  // En dev, logger le lien de preview Ethereal pour voir l'email
  if (env.nodeEnv !== 'production' && !env.smtpHost) {
    const previewUrl = nodemailer.getTestMessageUrl(info)
    console.log('📧 Email de test envoyé ! Aperçu :', previewUrl)
  }

  return info
}
