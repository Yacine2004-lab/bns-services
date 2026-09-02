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

    // startDate : stockeré en UTC minuit — la promo commence dès le début du jour local
    if (promo.startDate > now) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Cette promo n’est pas encore active.',
      })
    }

    // endDate : la promo est valide jusqu'à la fin du jour indiqué (23:59:59 UTC)
    if (promo.endDate) {
      const endOfDay = new Date(promo.endDate)
      endOfDay.setUTCHours(23, 59, 59, 999)
      if (endOfDay < now) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: 'Cette promo a expiré.',
        })
      }
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

    const promoType = String(promo.type).trim().toLowerCase()

    if (promoType === 'percentage' || promoType === 'percent' || promoType === 'pourcentage' || promoType === '%') {
      discount = (amount * Number(promo.value)) / 100
    } else if (promoType === 'fixed' || promoType === 'montant') {
      discount = Number(promo.value)
    }

    discount = Number.isFinite(discount) ? Math.min(Math.max(0, discount), amount) : 0

    return res.status(200).json({
      success: true,
      valid: true,
      code: promo.code,
      discount,
      message: 'Code promo appliqué avec succès.',
    })
  } catch (error) {
    next(error)
  }
}
