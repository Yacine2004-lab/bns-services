import dotenv from 'dotenv'

// Charger les variables d'environnement depuis le fichier .env
dotenv.config()

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtCustomerSecret: process.env.JWT_CUSTOMER_SECRET,
  jwtAdminSecret: process.env.JWT_ADMIN_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL,
  // Configuration SMTP (optionnel — Ethereal utilisé en dev si absent)
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  // Configuration OAuth (optionnel — boutons social login desactives si absent)
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  facebookClientId: process.env.FACEBOOK_CLIENT_ID || '',
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
}

// Vérifier que les secrets critiques sont définis
const missing = []
if (!env.jwtCustomerSecret) missing.push('JWT_CUSTOMER_SECRET')
if (!env.jwtAdminSecret) missing.push('JWT_ADMIN_SECRET')
if (!env.databaseUrl) missing.push('DATABASE_URL')

if (missing.length > 0) {
  console.error(`\n❌ Variables d'environnement manquantes : ${missing.join(', ')}\n`)
  console.error('Créez un fichier server/.env avec les valeurs requises.\n')
  process.exit(1)
}

// Avertir (sans crasher) si les credentials OAuth ne sont pas configures
if (!env.googleClientId || !env.googleClientSecret) {
  console.warn('⚠️  OAuth Google non configuré (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).')
  console.warn('   Le bouton "Continuer avec Google" sera désactivé sur la page de connexion.\n')
}
if (!env.facebookClientId || !env.facebookClientSecret) {
  console.warn('⚠️  OAuth Facebook non configuré (FACEBOOK_CLIENT_ID / FACEBOOK_CLIENT_SECRET).')
  console.warn('   Le bouton "Continuer avec Facebook" sera désactivé sur la page de connexion.\n')
}
