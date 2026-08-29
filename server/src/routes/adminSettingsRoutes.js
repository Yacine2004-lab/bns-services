import { Router } from 'express'
import { requireAdminAuth } from '../middlewares/adminAuthMiddleware.js'
import { getSettings, updateProfile, changePassword } from '../controllers/adminSettingsController.js'

const router = Router()

router.get('/settings', requireAdminAuth, getSettings)
router.put('/settings/profile', requireAdminAuth, updateProfile)
router.put('/settings/password', requireAdminAuth, changePassword)

export default router
