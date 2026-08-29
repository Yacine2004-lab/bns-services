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
