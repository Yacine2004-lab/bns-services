import { Router } from 'express'
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'
import { validate } from '../middlewares/validate.js'
import { requireCustomerAuth } from '../middlewares/authMiddleware.js'
import { authLimiter } from '../middlewares/rateLimiter.js'
import {
  customerRegisterSchema,
  customerLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidators.js'

const router = Router()

// Inscription client
router.post('/register', authLimiter, validate(customerRegisterSchema), register)

// Connexion client
router.post('/login', authLimiter, validate(customerLoginSchema), login)

// Profil client connecté (Protégé par JWT)
router.get('/me', requireCustomerAuth, getMe)

// Réinitialisation mot de passe
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword)

export default router
