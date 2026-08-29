import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import path from 'path'
import { env } from './config/env.js'
import apiRouter from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { globalApiLimiter } from './middlewares/rateLimiter.js'

const app = express()

// 0. Headers de securite (helmet gere tout : HSTS, CSP, X-Frame-Options, etc.)
app.use(helmet({
  // HSTS : forcer HTTPS en production (1 an)
  hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false,
  // Desactiver le CSP par defaut de helmet (on le configure manuellement ci-dessous)
  contentSecurityPolicy: false,
}))

// CSP personnalise : autoriser les images depuis Cloudinary et le backend
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
      // Autoriser les scripts uniquement depuis le frontend
      'script-src': ["'self'", "'unsafe-inline'"],
      // Autoriser les styles uniquement depuis le frontend
      'style-src': ["'self'", "'unsafe-inline'"],
    },
  }),
)

// 1. Securite et CORS (autoriser le frontend React)
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

// 2. Cookie parser (pour les cookies OAuth state)
app.use(cookieParser())

// 3. Limiteur de requetes global
app.use('/api', globalApiLimiter)

// 4. Fichiers statiques : images uploadées accessibles publiquement
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  maxAge: '7d',
  immutable: true,
}))

// 5. Parsers de corps de requete avec limites de taille
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 6. Montage des routes API sous le prefixe /api
app.use('/api', apiRouter)

// 7. Gestion des routes non trouvees (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route introuvable.',
  })
})

// 8. Gestionnaire d'erreurs centralise
app.use(errorHandler)

export default app
