import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { env } from './config/env.js'
import apiRouter from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { globalApiLimiter } from './middlewares/rateLimiter.js'

const app = express()

// 0. Headers de sécurité (helmet gère tout : HSTS, CSP, X-Frame-Options, etc.)
app.use(helmet())

// Autoriser les images depuis le backend et Cloudinary (CSP pour les images uploadées)
const imgSources = ["'self'", 'data:', 'https://res.cloudinary.com', 'https://images.unsplash.com']
if (env.nodeEnv === 'production') {
  imgSources.push(env.clientUrl)
} else {
  imgSources.push(`http://localhost:${env.port}`, env.clientUrl)
}

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': imgSources,
    },
  }),
)

// 1. Sécurité et CORS (autoriser le frontend React)
const corsOrigins =
  env.nodeEnv === 'production'
    ? [env.clientUrl]
    : [env.clientUrl, 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
)

// 2. Limiteur de requêtes global
app.use('/api', globalApiLimiter)

// 3. Fichiers statiques : images uploadées accessibles publiquement
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  maxAge: '7d',
  immutable: true,
}))

// 4. Parsers de corps de requête avec limites de taille
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 4. Montage des routes API sous le préfixe /api
app.use('/api', apiRouter)

// 4. Gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`,
  })
})

// 5. Gestionnaire d'erreurs centralisé
app.use(errorHandler)

export default app
