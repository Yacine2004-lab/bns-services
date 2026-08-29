import { prisma } from '../config/prisma.js'

// 1. Lister toutes les commandes de la boutique (Admin)
export async function getAdminOrders(req, res, next) {
  try {
    const { status, search, page = 1, limit = 50 } = req.query

    const pageNumber = Math.max(1, parseInt(page) || 1)
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit) || 50))
    const skip = (pageNumber - 1) * limitNumber

    const where = {}

    if (status && status !== 'ALL') {
      where.status = status
    }

    if (search && search.trim()) {
      const searchTerms = search.trim()
      where.OR = [
        { orderNumber: { contains: searchTerms, mode: 'insensitive' } },
        { customerName: { contains: searchTerms, mode: 'insensitive' } },
        { customerPhone: { contains: searchTerms, mode: 'insensitive' } },
        { customerEmail: { contains: searchTerms, mode: 'insensitive' } },
      ]
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          customer: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
      }),
      prisma.order.count({ where }),
    ])

    res.status(200).json({
      success: true,
      count: orders.length,
      total: totalCount,
      page: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

// 2. Mettre à jour le statut d'une commande (Admin) + Restitution automatique de stock si ANNULÉE
export async function updateAdminOrderStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    const existingOrder = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: { items: true },
    })

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: `Commande introuvable avec l'identifiant : ${id}`,
      })
    }

    const oldStatus = existingOrder.status
    const newStatus = status

    // Transaction pour mettre à jour le statut et restituer le stock si annulation
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Si la commande est nouvellement annulée, ré-incrémenter le stock des articles
      if (newStatus === 'CANCELLED' && oldStatus !== 'CANCELLED') {
        for (const item of existingOrder.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
              },
            })
          }
        }
      }

      // Si une commande précédemment annulée est réactivée, décrémenter à nouveau
      if (oldStatus === 'CANCELLED' && newStatus !== 'CANCELLED') {
        for (const item of existingOrder.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
              },
            })
          }
        }
      }

      return tx.order.update({
        where: { id: existingOrder.id },
        data: { status: newStatus },
        include: { items: true },
      })
    })

    res.status(200).json({
      success: true,
      message: `Statut de la commande mis à jour : ${newStatus}`,
      data: updatedOrder,
    })
  } catch (error) {
    next(error)
  }
}
