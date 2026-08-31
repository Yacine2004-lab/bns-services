import app from './app.js'
import { env } from './config/env.js'
import { initMailer } from './utils/mailer.js'
import { PrismaClient } from '@prisma/client'

const PORT = env.port
const prisma = new PrismaClient()

// Mettre a jour l'email admin au demarrage
async function ensureAdminEmail() {
  const NEW_EMAIL = 'contact@bayeniassservices.com'
  const OLD_EMAIL = 'admin@bnsservices.sn'
  try {
    const existing = await prisma.adminUser.findUnique({ where: { email: NEW_EMAIL } })
    if (existing) {
      console.log('✅ Admin email deja a jour:', NEW_EMAIL)
      return
    }
    const old = await prisma.adminUser.findUnique({ where: { email: OLD_EMAIL } })
    if (old) {
      await prisma.adminUser.update({ where: { email: OLD_EMAIL }, data: { email: NEW_EMAIL } })
      console.log('✅ Admin email mis a jour:', OLD_EMAIL, '->', NEW_EMAIL)
    } else {
      console.log('️ Aucun admin trouve avec', OLD_EMAIL, 'ou', NEW_EMAIL)
    }
  } catch (err) {
    console.warn('️ Erreur mise a jour email admin:', err.message)
  }
}

// Initialiser le service email au démarrage
initMailer().catch((err) => {
  console.warn('️ Erreur initialisation email :', err.message)
})

// Mettre a jour l'email admin puis demarrer le serveur
ensureAdminEmail().finally(() => {
  app.listen(PORT, () => {
    console.log(`\n==============================================`)
    console.log(`🚀 Serveur BNS Services démarré avec succès !`)
    console.log(` URL API : http://localhost:${PORT}/api`)
    console.log(`🩺 Health check : http://localhost:${PORT}/api/health`)
    console.log(`💻 Frontend autorisé : ${env.clientUrl}`)
    console.log(`==============================================\n`)
  })
})
