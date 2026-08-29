import { Router } from 'express'
import { requireAdminAuth } from '../middlewares/adminAuthMiddleware.js'
import { getCustomers, getCustomerDetails } from '../controllers/adminCustomerController.js'

const router = Router()

router.get('/customers', requireAdminAuth, getCustomers)
router.get('/customers/:id', requireAdminAuth, getCustomerDetails)

export default router
