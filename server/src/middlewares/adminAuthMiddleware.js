import { verifyAdminToken } from '../utils/jwt.js'
import { prisma } from '../config/prisma.js'

// Middleware strict pour protéger l'espace d'administration
export async function requireAdminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès administrateur refusé. Clé d\'autorisation manquante.',
      })
    }

    const token = authHeader.split(' ')[1]

    let decoded
    try {
      decoded = verifyAdminToken(token)
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: 'Session administrateur expirée ou invalide. Veuillez vous reconnecter.',
      })
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Droits administrateur requis.',
      })
    }

    // Récupérer l'administrateur en base
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: 'Compte administrateur introuvable.',
      })
    }

    req.adminUser = adminUser
    next()
  } catch (error) {
    next(error)
  }
}
