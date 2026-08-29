import { Router } from 'express'
import {
  getCategories,
  getCategoryById,
  getSubCategories,
  getSubCategoryById,
} from '../controllers/categoryController.js'

const router = Router()

// Routes Catégories
router.get('/categories', getCategories)
router.get('/categories/:id', getCategoryById)

// Routes Sous-catégories
router.get('/subcategories', getSubCategories)
router.get('/subcategories/:id', getSubCategoryById)

export default router
