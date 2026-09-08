import { Router } from 'express'
import { handlePaymentWebhook, initiatePayment } from '../controllers/paymentController.js'
import { optionalCustomerAuth } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/initiate', optionalCustomerAuth, initiatePayment)
router.post('/webhook', handlePaymentWebhook)

export default router
