import { Router } from 'express'
import { requireAdminAuth } from '../middlewares/adminAuthMiddleware.js'
import { upload, uploadProductImages, deleteProductImage } from '../controllers/uploadController.js'

const router = Router()

// Upload d'images produit (protégé admin, multer accepte jusqu'à 8 fichiers)
router.post('/upload', requireAdminAuth, upload.array('images', 8), uploadProductImages)

// Suppression d'une image produit
router.delete('/upload', requireAdminAuth, deleteProductImage)

export default router
