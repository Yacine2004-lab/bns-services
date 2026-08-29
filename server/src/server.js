import app from './app.js'
import { env } from './config/env.js'
import { initMailer } from './utils/mailer.js'

const PORT = env.port

// Initialiser le service email au démarrage
initMailer().catch((err) => {
  console.warn('⚠️ Erreur initialisation email :', err.message)
})

app.listen(PORT, () => {
  console.log(`\n==============================================`)
  console.log(`🚀 Serveur BNS Services démarré avec succès !`)
  console.log(`📡 URL API : http://localhost:${PORT}/api`)
  console.log(`🩺 Health check : http://localhost:${PORT}/api/health`)
  console.log(`💻 Frontend autorisé : ${env.clientUrl}`)
  console.log(`==============================================\n`)
})
