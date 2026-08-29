import { Router } from 'express'
import { adminLogin, getAdminMe, adminForgotPassword, adminResetPassword } from '../controllers/adminAuthController.js'
import { requireAdminAuth } from '../middlewares/adminAuthMiddleware.js'
import { authLimiter } from '../middlewares/rateLimiter.js'
import { validate } from '../middlewares/validate.js'
import { z } from 'zod'

// Schémas de validation admin
const adminForgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "L'email est requis." }).email("Format d'adresse email invalide."),
  }),
})

const adminResetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Le jeton de réinitialisation est requis.' }),
    newPassword: z.string({ required_error: 'Le nouveau mot de passe est requis.' }).min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  }),
})

const router = Router()

// Connexion Admin (Protégée contre le brute-force)
router.post('/login', authLimiter, adminLogin)

// Profil Admin connecté + Statistiques clés (Protégé)
router.get('/me', requireAdminAuth, getAdminMe)

// Réinitialisation mot de passe admin
router.post('/forgot-password', authLimiter, validate(adminForgotPasswordSchema), adminForgotPassword)
router.post('/reset-password', authLimiter, validate(adminResetPasswordSchema), adminResetPassword)

export default router
