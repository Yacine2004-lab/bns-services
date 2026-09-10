import app from './app.js'
import { env } from './config/env.js'
import { initMailer } from './utils/mailer.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const PORT = env.port

// Mettre a jour le schema et le compte admin
async function syncDatabaseSchemaAndAdmin() {
  const NEW_EMAIL = 'contact@bayeniassservices.com'
  const PASSWORD = 'bayeniass@26'
  const db = new PrismaClient()

  try {
    await db.$connect()
    console.log('DB connectee pour synchronisation schema et admin')

    // 1. Colonnes produits
    await db.$executeRawUnsafe('ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "promoPrice" DOUBLE PRECISION')
    await db.$executeRawUnsafe('ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "promoStartDate" TIMESTAMP(3)')
    await db.$executeRawUnsafe('ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "promoEndDate" TIMESTAMP(3)')

    // 2. Colonnes commandes
    await db.$executeRawUnsafe('ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discount" DOUBLE PRECISION NOT NULL DEFAULT 0')
    await db.$executeRawUnsafe('ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "promoCode" TEXT')
    await db.$executeRawUnsafe('ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "nabooPaymentId" TEXT')
    await db.$executeRawUnsafe('ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "stockDeducted" BOOLEAN NOT NULL DEFAULT true')

    // 3. Index unique nabooPaymentId
    try {
      await db.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "orders_nabooPaymentId_key" ON "orders"("nabooPaymentId")')
    } catch (e) {
      // Ignorer si deja present
    }

    // 4. Valeurs enum PaymentMethod (WAVE, ORANGE_MONEY)
    try {
      await db.$executeRawUnsafe("ALTER TYPE \"PaymentMethod\" ADD VALUE IF NOT EXISTS 'WAVE'")
    } catch (e) {
      // Ignorer si deja present
    }
    try {
      await db.$executeRawUnsafe("ALTER TYPE \"PaymentMethod\" ADD VALUE IF NOT EXISTS 'ORANGE_MONEY'")
    } catch (e) {
      // Ignorer si deja present
    }

    console.log('Schema Prisma synchronise avec succes')

    const hash = await bcrypt.hash(PASSWORD, 10)
    await db.adminUser.upsert({
      where: { email: NEW_EMAIL },
      update: { password: hash, name: 'Super Admin BNS', role: 'admin' },
      create: { email: NEW_EMAIL, name: 'Super Admin BNS', password: hash, role: 'admin' },
    })
    console.log('Compte admin synchronise:', NEW_EMAIL)
  } catch (err) {
    console.warn('Erreur synchronisation DB:', err.message)
  } finally {
    await db.$disconnect()
  }
}

// Initialiser le service email
initMailer().catch((err) => {
  console.warn('Erreur initialisation email :', err.message)
})

// Demarrer le serveur IMMEDIATEMENT
app.listen(PORT, () => {
  console.log('\n==============================================')
  console.log('Serveur BNS Services demarre avec succes !')
  console.log('URL API : http://localhost:' + PORT + '/api')
  console.log('Health check : http://localhost:' + PORT + '/api/health')
  console.log('Frontend autorise : ' + env.clientUrl)
  console.log('==============================================\n')
})

// Synchro schema et email admin au demarrage
syncDatabaseSchemaAndAdmin()
