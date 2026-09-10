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

// Railway / reverse proxy : req.protocol doit renvoyer https en production (OAuth callback)
if (env.nodeEnv === 'production') {
  app.set('trust proxy', 1)
}

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
const clientOrigin = env.clientUrl.endsWith('/') ? env.clientUrl.slice(0, -1) : env.clientUrl;

// Origines de base (toujours autorisees)
const baseOrigins = new Set([
  clientOrigin,
  'http://169.58.37.124:3006',
  'http://169.58.37.124',
  'https://bayeniassservice.com',
  'https://www.bayeniassservice.com',
  'http://bayeniassservice.com',
  'http://www.bayeniassservice.com',
  'https://bns-nine.vercel.app',
  'https://bns-services.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:3006',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
])

// Origines supplementaires depuis la variable d'environnement (separees par des virgules)
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean).forEach(o => baseOrigins.add(o))
}

const corsOrigins = [...baseOrigins]

// Fonction CORS dynamique : autorise les origines connues + les requetes sans origin (Postman, server-to-server)
const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requetes sans header Origin (Postman, curl, webhooks)
    if (!origin) return callback(null, true)
    if (corsOrigins.includes(origin)) return callback(null, true)
    console.warn(`[CORS] Origine bloquee: ${origin}`)
    callback(new Error(`CORS: origine non autorisee → ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // Eviter le 204 qui pose probleme sur certains browsers
}

app.use(cors(corsOptions))
// Repondre explicitement aux preflight OPTIONS sur toutes les routes
app.options('*', cors(corsOptions))

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
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buffer) => {
    if (req.originalUrl === '/api/payments/webhook') req.rawBody = Buffer.from(buffer)
  },
}))
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
