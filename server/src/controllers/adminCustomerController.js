import { prisma } from '../config/prisma.js'

// Lister tous les clients avec stats (nb commandes, total dépensé)
export async function getCustomers(req, res, next) {
  try {
    const { search, page = 1, limit = 50 } = req.query
    const pageNumber = Math.max(1, parseInt(page) || 1)
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit) || 50))
    const skip = (pageNumber - 1) * limitNumber

    const where = {}

    if (search && search.trim()) {
      const term = search.trim()
      where.OR = [
        { firstName: { contains: term, mode: 'insensitive' } },
        { lastName: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term, mode: 'insensitive' } },
      ]
    }

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
          orders: {
            select: {
              id: true,
              total: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
      }),
      prisma.customer.count({ where }),
    ])

    const formatted = customers.map((c) => {
      const orderCount = c.orders.length
      const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0)
      const lastOrder = c.orders.length
        ? c.orders.sort((a, b) => new Date(b.id) - new Date(a.id))[0]
        : null

      return {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        orderCount,
        totalSpent,
        lastOrderDate: lastOrder ? c.orders.find(o => o.id === lastOrder.id)?.createdAt : null,
        createdAt: c.createdAt,
      }
    })

    res.status(200).json({
      success: true,
      count: formatted.length,
      total: totalCount,
      page: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
      data: formatted,
    })
  } catch (error) {
    next(error)
  }
}

// Détails d'un client (profil + historique commandes)
export async function getCustomerDetails(req, res, next) {
  try {
    const { id } = req.params

    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          include: {
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Client introuvable.',
      })
    }

    const totalSpent = customer.orders.reduce((sum, o) => sum + o.total, 0)

    res.status(200).json({
      success: true,
      data: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        createdAt: customer.createdAt,
        orderCount: customer.orders.length,
        totalSpent,
        orders: customer.orders,
      },
    })
  } catch (error) {
    next(error)
  }
}
