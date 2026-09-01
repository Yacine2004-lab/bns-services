import { prisma } from '../config/prisma.js'

export async function getPromos(req, res, next) {
  try {
    const promos = await prisma.promo.findMany({
      orderBy: { createdAt: 'desc' },
    })

    res.status(200).json({
      success: true,
      data: promos,
    })
  } catch (error) {
    next(error)
  }
}

export async function createPromo(req, res, next) {
  try {
    const { code, description, type, value, minOrder, active, startDate, endDate, usageLimit } = req.body

    if (!code || !type || value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: 'Le code, le type et la valeur sont requis.',
      })
    }

    const normalizedCode = String(code).trim().toUpperCase()

    const existing = await prisma.promo.findUnique({
      where: { code: normalizedCode },
    })

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Ce code promo existe déjà.',
      })
    }

    const promo = await prisma.promo.create({
      data: {
        code: normalizedCode,
        description: description || '',
        type,
        value: Number(value),
        minOrder: Number(minOrder || 0),
        active: active !== false,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Code promo créé avec succès.',
      data: promo,
    })
  } catch (error) {
    next(error)
  }
}

export async function updatePromo(req, res, next) {
  try {
    const { id } = req.params
    const payload = req.body

    const promo = await prisma.promo.update({
      where: { id },
      data: {
        ...payload,
        code: payload.code ? String(payload.code).trim().toUpperCase() : undefined,
        value: payload.value !== undefined ? Number(payload.value) : undefined,
        minOrder: payload.minOrder !== undefined ? Number(payload.minOrder) : undefined,
        usageLimit: payload.usageLimit !== undefined ? Number(payload.usageLimit) : undefined,
        startDate: payload.startDate ? new Date(payload.startDate) : undefined,
        endDate: payload.endDate ? new Date(payload.endDate) : undefined,
      },
    })

    res.status(200).json({
      success: true,
      message: 'Code promo mis à jour avec succès.',
      data: promo,
    })
  } catch (error) {
    next(error)
  }
}

export async function deletePromo(req, res, next) {
  try {
    const { id } = req.params

    await prisma.promo.delete({
      where: { id },
    })

    res.status(200).json({
      success: true,
      message: 'Code promo supprimé avec succès.',
    })
  } catch (error) {
    next(error)
  }
}
