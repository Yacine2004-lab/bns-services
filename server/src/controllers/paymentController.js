import crypto from 'crypto'
import { env } from '../config/env.js'
import { prisma } from '../config/prisma.js'

const ONLINE_METHODS = new Set(['WAVE', 'ORANGE_MONEY'])
const SUCCESS_STATUS = 'completed'
const FAILED_STATUSES = new Set(['failed', 'cancelled', 'canceled', 'expired'])

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/)
  return { first_name: parts.shift() || 'Client', last_name: parts.join(' ') || 'BNS' }
}

function normalizePhone(phone) {
  return (phone || '').replace(/\D/g, '')
}

export async function initiatePayment(req, res, next) {
  try {
    if (!env.nabooApiKey) {
      return res.status(503).json({ success: false, message: 'Le paiement en ligne n’est pas encore configuré.' })
    }

    const { orderNumber, paymentMethod, phone } = req.body
    if (!orderNumber || !ONLINE_METHODS.has(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Référence ou moyen de paiement invalide.' })
    }

    const order = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } })
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable.' })
    if (order.status !== 'PENDING' || order.paymentStatus !== 'PENDING') {
      return res.status(409).json({ success: false, message: 'Cette commande ne peut plus être payée.' })
    }

    if (req.customer) {
      if (order.customerId !== req.customer.id) return res.status(403).json({ success: false, message: 'Accès refusé.' })
    } else if (normalizePhone(order.customerPhone) !== normalizePhone(phone)) {
      return res.status(403).json({ success: false, message: 'Téléphone de commande incorrect.' })
    }

    const name = splitName(order.customerName)
    const payload = {
      method_of_payment: [paymentMethod === 'WAVE' ? 'wave' : 'orange_money'],
      products: order.items.map((item) => ({
        name: item.productName,
        price: item.productPrice,
        quantity: item.quantity,
        description: item.productReference || item.productName,
      })),
      customer: { ...name, phone: order.customerPhone },
      success_url: `${env.clientUrl}/commande/succes?order=${encodeURIComponent(order.orderNumber)}`,
      error_url: `${env.clientUrl}/commande/echec?order=${encodeURIComponent(order.orderNumber)}`,
      fees_customer_side: false,
      is_escrow: false,
    }

    const response = await fetch(`${env.nabooApiUrl}/api/v2/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.nabooApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok || !result.checkout_url || !result.order_id) {
      return res.status(502).json({ success: false, message: result.error || 'NabooPay n’a pas pu créer le paiement.' })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { paymentMethod, nabooPaymentId: result.order_id },
    })

    return res.status(200).json({
      success: true,
      data: { checkoutUrl: result.checkout_url, order: updatedOrder },
    })
  } catch (error) {
    next(error)
  }
}

export async function handlePaymentWebhook(req, res, next) {
  try {
    if (!env.nabooWebhookSecret || !req.rawBody) return res.status(503).json({ success: false, message: 'Webhook non configuré.' })

    const signature = req.get('X-Signature') || ''
    const expected = crypto.createHmac('sha256', env.nabooWebhookSecret).update(req.rawBody).digest('hex')
    const valid = signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    if (!valid) return res.status(401).json({ success: false, message: 'Signature webhook invalide.' })

    const { order_id: nabooPaymentId, transaction_status: transactionStatus } = req.body
    const order = await prisma.order.findUnique({ where: { nabooPaymentId }, include: { items: true } })
    if (!order) return res.status(404).json({ success: false, message: 'Commande associée introuvable.' })
    if (order.paymentStatus === 'PAID') return res.status(200).json({ success: true, message: 'Notification déjà traitée.' })

    if (transactionStatus === SUCCESS_STATUS) {
      await prisma.$transaction(async (tx) => {
        const currentOrder = await tx.order.findUnique({ where: { id: order.id }, include: { items: true } })
        if (currentOrder.paymentStatus === 'PAID') return
        if (!currentOrder.stockDeducted) {
          for (const item of currentOrder.items) {
            if (!item.productId) continue
            const updated = await tx.product.updateMany({
              where: { id: item.productId, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            })
            if (updated.count !== 1) throw new Error(`Stock insuffisant pour ${item.productName}.`)
          }
        }
        await tx.order.update({
          where: { id: currentOrder.id },
          data: { paymentStatus: 'PAID', status: 'CONFIRMED', stockDeducted: true },
        })
      })
    } else if (FAILED_STATUSES.has(transactionStatus)) {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'FAILED' } })
    }

    return res.status(200).json({ success: true, message: 'Notification reçue.' })
  } catch (error) {
    next(error)
  }
}
