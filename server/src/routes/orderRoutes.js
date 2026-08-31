import { Router } from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderByNumber,
  cancelMyOrder,
} from '../controllers/orderController.js'
import { validate } from '../middlewares/validate.js'
import {
  requireCustomerAuth,
  optionalCustomerAuth,
} from '../middlewares/authMiddleware.js'
import { createOrderSchema } from '../validators/orderValidators.js'

const router = Router()

// Créer une commande (invité ou connecté)
router.post('/orders', optionalCustomerAuth, validate(createOrderSchema), createOrder)

// Historique des commandes du client connecté
router.get('/orders/my-orders', requireCustomerAuth, getMyOrders)

// Annuler une commande en attente (client connecté uniquement)
router.patch('/orders/:orderNumber/cancel', requireCustomerAuth, cancelMyOrder)

// Consulter une commande par son numéro (authentification optionnelle)
router.get('/orders/:orderNumber', optionalCustomerAuth, getOrderByNumber)

export default router
