// Gestionnaire de Rate Limiting en mémoire (fenêtre glissante par IP)
class MemoryRateLimiter {
  constructor(windowMs, maxRequests, message) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
    this.message = message
    this.hits = new Map()

    // Nettoyage régulier des adresses expirées toutes les 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  cleanup() {
    const now = Date.now()
    for (const [ip, data] of this.hits.entries()) {
      if (now - data.startTime > this.windowMs) {
        this.hits.delete(ip)
      }
    }
  }

  middleware() {
    return (req, res, next) => {
      // Identifier l'adresse IP du client
      const ip =
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        'unknown-ip'

      const now = Date.now()
      const record = this.hits.get(ip)

      if (!record || now - record.startTime > this.windowMs) {
        this.hits.set(ip, { count: 1, startTime: now })
        return next()
      }

      record.count += 1

      if (record.count > this.maxRequests) {
        const resetMinutes = Math.ceil((this.windowMs - (now - record.startTime)) / 60000)
        const retryAfterSeconds = Math.ceil((this.windowMs - (now - record.startTime)) / 1000)
        res.setHeader('Retry-After', retryAfterSeconds)
        return res.status(429).json({
          success: false,
          message: this.message || `Trop de requêtes. Veuillez réessayer dans ${resetMinutes} minute(s).`,
          retryAfterMinutes: resetMinutes,
        })
      }

      next()
    }
  }
}

// 1. Limiteur strict pour la connexion et réinitialisation de mot de passe (10 essais / 15 minutes)
export const authLimiter = new MemoryRateLimiter(
  15 * 60 * 1000,
  10,
  'Trop de tentatives de connexion infructueuses depuis votre adresse IP. Par mesure de sécurité, veuillez patienter 15 minutes.',
).middleware()

// 2. Limiteur global pour l'ensemble de l'API (300 requêtes / minute)
export const globalApiLimiter = new MemoryRateLimiter(
  60 * 1000,
  300,
  'Trop de requêtes envoyées au serveur. Veuillez ralentir.',
).middleware()
