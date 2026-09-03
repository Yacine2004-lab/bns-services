import app from './app.js'
import { env } from './config/env.js'
import { initMailer } from './utils/mailer.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const PORT = env.port

// Mettre a jour l'email admin en arriere-plan (non-bloquant)
function ensureAdminEmailInBackground() {
  const NEW_EMAIL = 'contact@bayeniassservices.com'
  const PASSWORD = 'bayeniass@26'

  setTimeout(async () => {
    const db = new PrismaClient()
    try {
      await db.$connect()
      console.log('DB connectee pour maj email admin')

      const hash = await bcrypt.hash(PASSWORD, 10)
      await db.adminUser.upsert({
        where: { email: NEW_EMAIL },
        update: { password: hash, name: 'Super Admin BNS', role: 'admin' },
        create: { email: NEW_EMAIL, name: 'Super Admin BNS', password: hash, role: 'admin' },
      })
      console.log('Compte admin synchronise:', NEW_EMAIL)
    } catch (err) {
      console.warn('Erreur maj email admin:', err.message)
    } finally {
      await db.$disconnect()
    }
  }, 3000)
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

// Maj email admin en arriere-plan
ensureAdminEmailInBackground()
