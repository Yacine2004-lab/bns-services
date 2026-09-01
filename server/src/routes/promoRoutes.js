import { Router } from 'express'
import { validatePromo } from '../controllers/promoController.js'
import { optionalCustomerAuth } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/validate', optionalCustomerAuth, validatePromo)

export default router
