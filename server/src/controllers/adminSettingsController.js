import bcrypt from 'bcryptjs'
import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'

// 1. Récupérer les paramètres (profil admin + infos système)
export async function getSettings(req, res, next) {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: req.adminUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Statistiques système
    const [totalProducts, totalCustomers, totalOrders, totalCategories, pendingOrders] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count(),
      prisma.category.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
    ])

    // Chiffre d'affaires total
    const ordersAgg = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } },
    })

    res.status(200).json({
      success: true,
      data: {
        admin,
        system: {
          port: env.port,
          clientUrl: env.clientUrl,
          jwtExpiresIn: env.jwtExpiresIn,
          databaseUrl: env.databaseUrl?.replace(/\/\/.*@/, '//***@') || 'Non configurée',
          nodeVersion: process.version,
          uptime: process.uptime(),
        },
        stats: {
          totalProducts,
          totalCustomers,
          totalOrders,
          totalCategories,
          pendingOrders,
          totalRevenue: ordersAgg._sum.total || 0,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// 2. Mettre à jour le profil admin (nom, email)
export async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body
    const adminId = req.adminUser.id

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Le nom est requis.' })
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "L'email est requis." })
    }

    const cleanEmail = email.trim().toLowerCase()

    // Vérifier que l'email n'est pas déjà utilisé par un autre admin
    const existing = await prisma.adminUser.findFirst({
      where: { email: cleanEmail, NOT: { id: adminId } },
    })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé par un autre administrateur.',
      })
    }

    const updated = await prisma.adminUser.update({
      where: { id: adminId },
      data: {
        name: name.trim(),
        email: cleanEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    })

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès.',
      data: updated,
    })
  } catch (error) {
    next(error)
  }
}

// 3. Changer le mot de passe admin
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body
    const adminId = req.adminUser.id

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe actuel et le nouveau sont requis.',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.',
      })
    }

    // Vérifier le mot de passe actuel
    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
    })

    const isMatch = await bcrypt.compare(currentPassword, admin.password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe actuel est incorrect.',
      })
    }

    // Hacher et sauvegarder le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.adminUser.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    })

    res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès.',
    })
  } catch (error) {
    next(error)
  }
}
