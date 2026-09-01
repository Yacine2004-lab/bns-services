import { Router } from 'express'
import {
  getPromos,
  createPromo,
  updatePromo,
  deletePromo,
} from '../controllers/adminPromoController.js'
import { requireAdminAuth } from '../middlewares/adminAuthMiddleware.js'

const router = Router()

router.get('/promotions', requireAdminAuth, getPromos)
router.post('/promotions', requireAdminAuth, createPromo)
router.put('/promotions/:id', requireAdminAuth, updatePromo)
router.delete('/promotions/:id', requireAdminAuth, deletePromo)

export default router
