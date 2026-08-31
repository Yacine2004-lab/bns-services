import app from './app.js'
import { env } from './config/env.js'
import { initMailer } from './utils/mailer.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const PORT = env.port
const prisma = new PrismaClient()

// Mettre a jour l'email admin au demarrage
async function ensureAdminEmail() {
  const NEW_EMAIL = 'contact@bayeniassservices.com'
  const OLD_EMAIL = 'admin@bnsservices.sn'
  const PASSWORD = 'admin1234'
  try {
    // 1. Supprimer tout admin avec le nouveau email (doublon mal cree)
    const dupes = await prisma.adminUser.deleteMany({ where: { email: NEW_EMAIL } })
    if (dupes.count > 0) {
      console.log('🗑️ Supprime', dupes.count, 'admin(s) en doublon avec le nouveau email')
    }

    // 2. Chercher l'admin avec l'ancien email
    const old = await prisma.adminUser.findUnique({ where: { email: OLD_EMAIL } })
    if (old) {
      // Mettre a jour l'email et rehasher le mot de passe
      const hash = await bcrypt.hash(PASSWORD, 10)
      await prisma.adminUser.update({
        where: { email: OLD_EMAIL },
        data: { email: NEW_EMAIL, password: hash },
      })
      console.log('✅ Admin email mis a jour:', OLD_EMAIL, '->', NEW_EMAIL)
      return
    }

    // 3. Si aucun admin n'existe, en creer un
    const hash = await bcrypt.hash(PASSWORD, 10)
    await prisma.adminUser.create({
      data: { email: NEW_EMAIL, name: 'Super Admin BNS', password: hash, role: 'admin' },
    })
    console.log('✅ Nouvel admin cree avec email:', NEW_EMAIL)
  } catch (err) {
    console.warn('⚠️ Erreur mise a jour email admin:', err.message)
  }
}

// Initialiser le service email au démarrage
initMailer().catch((err) => {
  console.warn('⚠️ Erreur initialisation email :', err.message)
})

// Mettre a jour l'email admin puis demarrer le serveur
ensureAdminEmail().finally(() => {
  app.listen(PORT, () => {
    console.log(`\n==============================================`)
    console.log(` Serveur BNS Services démarré avec succès !`)
    console.log(`📡 URL API : http://localhost:${PORT}/api`)
    console.log(`🩺 Health check : http://localhost:${PORT}/api/health`)
    console.log(`💻 Frontend autorisé : ${env.clientUrl}`)
    console.log(`==============================================\n`)
  })
})
