import app from './app.js'
import { env } from './config/env.js'
import { initMailer } from './utils/mailer.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const PORT = env.port

// Mettre a jour l'email admin en arriere-plan (non-bloquant)
function ensureAdminEmailInBackground() {
  const NEW_EMAIL = 'contact@bayeniassservices.com'
  const OLD_EMAIL = 'admin@bnsservices.sn'
  const PASSWORD = 'admin1234'

  setTimeout(async () => {
    const db = new PrismaClient()
    try {
      await db.$connect()
      console.log('DB connectee pour maj email admin')

      const dupes = await db.adminUser.deleteMany({ where: { email: NEW_EMAIL } })
      if (dupes.count > 0) console.log('Supprime', dupes.count, 'admin(s) en doublon')

      const old = await db.adminUser.findUnique({ where: { email: OLD_EMAIL } })
      if (old) {
        const hash = await bcrypt.hash(PASSWORD, 10)
        await db.adminUser.update({
          where: { email: OLD_EMAIL },
          data: { email: NEW_EMAIL, password: hash },
        })
        console.log('Admin email mis a jour:', OLD_EMAIL, '->', NEW_EMAIL)
      } else {
        const hash = await bcrypt.hash(PASSWORD, 10)
        await db.adminUser.create({
          data: { email: NEW_EMAIL, name: 'Super Admin BNS', password: hash, role: 'admin' },
        })
        console.log('Nouvel admin cree:', NEW_EMAIL)
      }
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
