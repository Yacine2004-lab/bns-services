import { verifyCustomerToken } from '../utils/jwt.js'
import { prisma } from '../config/prisma.js'

// Middleware pour exiger une authentification client valide
export async function requireCustomerAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Veuillez vous connecter pour accéder à cette ressource.',
      })
    }

    const token = authHeader.split(' ')[1]

    let decoded
    try {
      decoded = verifyCustomerToken(token)
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: 'Session expirée ou invalide. Veuillez vous reconnecter.',
      })
    }

    // Récupérer le client depuis la base de données
    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    })

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Compte client introuvable.',
      })
    }

    // Attacher l'utilisateur authentifié à la requête
    req.customer = customer
    next()
  } catch (error) {
    next(error)
  }
}

// Middleware optionnel : attache le client s'il est connecté, sinon continue sans bloquer
export async function optionalCustomerAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      try {
        const decoded = verifyCustomerToken(token)
        const customer = await prisma.customer.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        })
        if (customer) {
          req.customer = customer
        }
      } catch {
        // Token invalide ou expiré : on ignore en mode optionnel
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}
