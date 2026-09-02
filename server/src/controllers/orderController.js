import { prisma } from '../config/prisma.js'
import { getDeliveryFee } from '../config/pricing.js'

// Générateur de numéro de commande unique (ex: CMD-748291)
function generateOrderNumber() {
  const randomDigits = Math.floor(100000 + Math.random() * 900000)
  return `CMD-${randomDigits}`
}

// Delai d'annulation autorise pour le client : 1h apres la creation
const CANCELLATION_DEADLINE_MS = 1 * 60 * 60 * 1000

// 1. Créer une nouvelle commande (Transaction atomique + Décrémentation du stock)
export async function createOrder(req, res, next) {
  try {
    const {
      items,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      shippingCity,
      shippingNotes,
      paymentMethod = 'CASH_ON_DELIVERY',
      promoCode,
    } = req.body

    // Si le client est connecté via le middleware optionalCustomerAuth
    const customerId = req.customer?.id || null

    // Transaction atomique : vérifie le stock, crée la commande et décrémente le stock
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0
      const orderItemsToCreate = []

      for (const item of items) {
        // Rechercher le produit en base par ID ou Slug
        const product = await tx.product.findFirst({
          where: {
            OR: [
              ...(item.productId ? [{ id: item.productId }] : []),
              ...(item.slug ? [{ slug: item.slug }] : []),
            ],
          },
        })

        if (!product) {
          throw new Error(`Le produit demandé est introuvable.`)
        }

        // Vérification stricte du stock disponible
        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuffisant pour "${product.name}". Stock restant : ${product.stock} unité(s), demandé : ${item.quantity}.`,
          )
        }

        // Décrémenter le stock immédiatement
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })

        const itemTotal = product.price * item.quantity
        subtotal += itemTotal

        // Ligne de commande avec prix unitaire figé
        orderItemsToCreate.push({
          productId: product.id,
          productName: product.name,
          productReference: product.reference,
          productImage: product.image,
          productPrice: product.price,
          quantity: item.quantity,
          total: itemTotal,
        })
      }

      const shippingFee = getDeliveryFee(shippingCity)
      
      let discount = 0
      let appliedPromoCode = null

      if (promoCode) {
        const normalizedCode = String(promoCode).trim().toUpperCase()
        const promo = await tx.promo.findUnique({ where: { code: normalizedCode } })
        
        if (promo && promo.active) {
          const now = new Date()
          const endOfDay = promo.endDate ? new Date(promo.endDate) : null
          if (endOfDay) endOfDay.setUTCHours(23, 59, 59, 999)
          const isValidDate = promo.startDate <= now && (!endOfDay || endOfDay >= now)
          const isMinOrderMet = subtotal >= promo.minOrder
          const isLimitNotReached = !promo.usageLimit || promo.usedCount < promo.usageLimit
          
          if (isValidDate && isMinOrderMet && isLimitNotReached) {
            if (promo.type === 'percentage') {
              discount = (subtotal * Number(promo.value)) / 100
            } else if (promo.type === 'fixed') {
              discount = Number(promo.value)
            }
            discount = Math.max(0, discount)
            appliedPromoCode = promo.code
            
            // Incrémenter l'utilisation de la promo
            await tx.promo.update({
              where: { id: promo.id },
              data: { usedCount: { increment: 1 } },
            })
          }
        }
      }

      const total = Math.max(0, subtotal + shippingFee - discount)

      // Générer un numéro de commande unique
      let orderNumber = generateOrderNumber()
      while (await tx.order.findUnique({ where: { orderNumber } })) {
        orderNumber = generateOrderNumber()
      }

      // Créer la commande et ses lignes associées
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : null,
          shippingAddress: shippingAddress.trim(),
          shippingCity: shippingCity.trim(),
          shippingNotes: shippingNotes ? shippingNotes.trim() : null,
          status: 'PENDING',
          paymentMethod,
          paymentStatus: 'PENDING',
          subtotal,
          shippingFee,
          discount,
          promoCode: appliedPromoCode,
          total,
          shippingNotes: shippingNotes ? shippingNotes.trim() : null,
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      })

      return order
    })

    res.status(201).json({
      success: true,
      message: 'Commande enregistrée avec succès !',
      data: result,
    })
  } catch (error) {
    // Si l'erreur provient de la vérification de stock
    if (error.message.includes('Stock insuffisant') || error.message.includes('introuvable')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

// 2. Récupérer les commandes du client connecté
export async function getMyOrders(req, res, next) {
  try {
    const customerId = req.customer.id
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 20))
    const skip = (page - 1) * limit

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { customerId },
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { customerId } }),
    ])

    res.status(200).json({
      success: true,
      count: orders.length,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

// 3. Récupérer le détail d'une commande par son numéro (ex: CMD-123456) ou ID
export async function getOrderByNumber(req, res, next) {
  try {
    const { orderNumber } = req.params

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber }, { id: orderNumber }],
      },
      include: {
        items: true,
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Commande introuvable avec la référence : ${orderNumber}`,
      })
    }

    // Si le client est connecté, vérifier qu'il est propriétaire de la commande
    if (req.customer && order.customerId && order.customerId !== req.customer.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas accès à cette commande.',
      })
    }

    res.status(200).json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

// 4. Annuler une commande en attente (client authentifie uniquement)
export async function cancelMyOrder(req, res, next) {
  try {
    const { orderNumber } = req.params
    const customerId = req.customer?.id

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Vous devez etre connecte pour annuler une commande.',
      })
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        customerId: true,
        status: true,
        createdAt: true,
        items: { select: { productId: true, quantity: true } },
      },
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable : ' + orderNumber,
      })
    }

    if (order.customerId !== customerId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas le droit d'annuler cette commande.",
      })
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Impossible d\'annuler une commande avec le statut "' + order.status + '". Seules les commandes en attente peuvent etre annulees.',
      })
    }

    // Verifier le delai d'annulation (1h par defaut)
    const elapsedMs = Date.now() - new Date(order.createdAt).getTime()
    if (elapsedMs > CANCELLATION_DEADLINE_MS) {
      const minutesElapsed = Math.floor(elapsedMs / (60 * 1000))
      return res.status(400).json({
        success: false,
        message: 'Le delai d\'annulation de 1h est depasse (commande passee il y a ' + minutesElapsed + ' min). Contactez le service client pour demander une annulation.',
      })
    }

    // Transaction : annuler la commande + restaurer le stock
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      }

      await tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      })
    })

    res.status(200).json({
      success: true,
      message: 'Votre commande a ete annulee avec succes. Le stock a ete restaure.',
    })
  } catch (error) {
    next(error)
  }
}
