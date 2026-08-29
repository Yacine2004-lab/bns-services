import { Router } from 'express'
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { validate } from '../middlewares/validate.js'
import { requireAdminAuth } from '../middlewares/adminAuthMiddleware.js'
import {
  createProductSchema,
  updateProductSchema,
} from '../validators/productValidators.js'

const router = Router()

// Routes de consultation (publiques)
router.get('/products', getProducts)
router.get('/products/:idOrSlug', getProductBySlug)

// Routes de gestion (CRUD) — protégées par authentification admin
router.post('/products', requireAdminAuth, validate(createProductSchema), createProduct)
router.put('/products/:id', requireAdminAuth, validate(updateProductSchema), updateProduct)
router.delete('/products/:id', requireAdminAuth, deleteProduct)

export default router
