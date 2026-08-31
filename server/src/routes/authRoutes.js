import { Router } from 'express'
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/authController.js'
import { oauthRedirect, oauthCallback } from '../controllers/oauthController.js'
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

// Mise a jour du profil (nom, prenom, telephone)
router.put('/profile', requireCustomerAuth, updateProfile)

// Changement de mot de passe
router.put('/password', requireCustomerAuth, changePassword)

// Suppression du compte
router.delete('/account', requireCustomerAuth, deleteAccount)

// Réinitialisation mot de passe
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword)

// OAuth social login (Google, Facebook)
router.get('/google', oauthRedirect('google'))
router.get('/google/callback', oauthCallback('google'))
router.get('/facebook', oauthRedirect('facebook'))
router.get('/facebook/callback', oauthCallback('facebook'))

// Statut des providers OAuth (utilise par le frontend pour activer/desactiver les boutons)
router.get('/oauth-status', (req, res) => {
  res.json({
    success: true,
    providers: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      facebook: Boolean(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
    },
  })
})

export default router
