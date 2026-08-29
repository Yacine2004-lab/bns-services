import { Router } from 'express'
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from '../controllers/adminOrderController.js'
import { requireAdminAuth } from '../middlewares/adminAuthMiddleware.js'
import { validate } from '../middlewares/validate.js'
import { updateOrderStatusSchema } from '../validators/orderValidators.js'

const router = Router()

// Lister toutes les commandes (Admin)
router.get('/orders', requireAdminAuth, getAdminOrders)

// Modifier le statut d'une commande (Admin)
router.patch(
  '/orders/:id/status',
  requireAdminAuth,
  validate(updateOrderStatusSchema),
  updateAdminOrderStatus,
)

export default router
