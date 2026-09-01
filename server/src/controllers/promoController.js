import { prisma } from '../config/prisma.js'

export async function validatePromo(req, res, next) {
  try {
    const { code, subtotal } = req.body

    if (!code || subtotal === undefined || subtotal === null) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Le code promo et le montant sont requis.',
      })
    }

    const normalizedCode = String(code).trim().toUpperCase()
    const amount = Number(subtotal)

    const promo = await prisma.promo.findUnique({
      where: { code: normalizedCode },
    })

    if (!promo) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Code promo invalide.',
      })
    }

    if (!promo.active) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Cette promo est désactivée.',
      })
    }

    const now = new Date()
    if (promo.startDate > now) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Cette promo n’est pas encore active.',
      })
    }

    if (promo.endDate && promo.endDate < now) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Cette promo a expiré.',
      })
    }

    if (amount < promo.minOrder) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Le montant minimum de commande pour cette promo est de ${promo.minOrder} FCFA.`,
      })
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Cette promo a atteint sa limite d’utilisation.',
      })
    }

    let discount = 0

    if (promo.type === 'percentage') {
      discount = (amount * Number(promo.value)) / 100
    } else if (promo.type === 'fixed') {
      discount = Number(promo.value)
    }

    return res.status(200).json({
      success: true,
      valid: true,
      code: promo.code,
      discount: Math.max(0, discount),
      message: 'Code promo appliqué avec succès.',
    })
  } catch (error) {
    next(error)
  }
}
