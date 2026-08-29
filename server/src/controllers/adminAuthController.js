import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '../config/prisma.js'
import { generateAdminToken } from '../utils/jwt.js'
import { sendPasswordResetEmail } from '../utils/mailer.js'

// 1. Connexion Administrateur
export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body

    const cleanEmail = email.trim().toLowerCase()

    const admin = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    })

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants administrateur incorrects.',
      })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants administrateur incorrects.',
      })
    }

    const token = generateAdminToken(admin)

    res.status(200).json({
      success: true,
      message: 'Connexion administrateur réussie !',
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// 2. Profil de l'administrateur connecté + statistiques globales
export async function getAdminMe(req, res, next) {
  try {
    // Statistiques globales du système
    const [totalProducts, totalCustomers, totalOrders, pendingOrders] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
    ])

    res.status(200).json({
      success: true,
      data: {
        admin: req.adminUser,
        stats: {
          totalProducts,
          totalCustomers,
          totalOrders,
          pendingOrders,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// 3. Mot de passe oublié — Administrateur
export async function adminForgotPassword(req, res, next) {
  try {
    const { email } = req.body
    const cleanEmail = email.trim().toLowerCase()

    const admin = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    })

    if (!admin) {
      // Sécurité : ne pas divulguer si l'email existe
      return res.status(200).json({
        success: true,
        message: 'Si un compte existe avec cette adresse email, un lien de réinitialisation vous a été envoyé.',
      })
    }

    // Génération d'un jeton aléatoire sécurisé valide 1 heure
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetPasswordExpires = new Date(Date.now() + 3600000) // 1h

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    })

    // Envoi de l'email de réinitialisation
    try {
      await sendPasswordResetEmail(cleanEmail, resetToken, 'admin')
    } catch (mailError) {
      console.error('Erreur envoi email reset admin :', mailError.message)
    }

    // En dev, on retourne le token pour faciliter les tests
    res.status(200).json({
      success: true,
      message: 'Instructions de réinitialisation envoyées.',
      devResetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    })
  } catch (error) {
    next(error)
  }
}

// 4. Réinitialisation du mot de passe — Administrateur
export async function adminResetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body

    const admin = await prisma.adminUser.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() },
      },
    })

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Le jeton de réinitialisation est invalide ou a expiré.',
      })
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })

    res.status(200).json({
      success: true,
      message: 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.',
    })
  } catch (error) {
    next(error)
  }
}
