import { prisma } from '../config/prisma.js'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configuration multer : stockage en mémoire pour upload vers Cloudinary
const storage = multer.memoryStorage()

// Extensions d'images autorisées (double vérification : mimetype + extension)
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

// Filtrer : accepter uniquement les images (mimetype + extension)
const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (file.mimetype.startsWith('image/') && ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Seules les images jpg, png, webp et gif sont acceptées.'), false)
  }
}

// Instance multer configurée (max 8 fichiers, 5 Mo chacun)
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo par fichier
})

/**
 * POST /api/admin/upload
 * Upload d'une ou plusieurs images de produit vers Cloudinary.
 * Retourne les URLs optimisées pour chaque image uploadée.
 */
export async function uploadProductImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez sélectionner au moins une image.',
      })
    }

    // Upload chaque image vers Cloudinary
    const results = []
    for (const file of req.files) {
      // Convertir le buffer en base64 pour Cloudinary
      const b64 = Buffer.from(file.buffer).toString('base64')
      const dataURI = `data:${file.mimetype};base64,${b64}`

      // Upload image principale (max 1200px)
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'bns-products',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
        resource_type: 'image',
      })

      // URL thumbnail (400px)
      const thumbUrl = cloudinary.url(uploadResult.public_id, {
        transformation: [
          { width: 400, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      })

      results.push({
        full: uploadResult.secure_url,
        thumb: thumbUrl,
        publicId: uploadResult.public_id,
      })
    }

    res.status(200).json({
      success: true,
      message: `${results.length} image${results.length > 1 ? 's' : ''} uploadée${results.length > 1 ? 's' : ''} et optimisée${results.length > 1 ? 's' : ''}.`,
      data: results,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/admin/upload
 * Supprimer une image de Cloudinary.
 */
export async function deleteProductImage(req, res, next) {
  try {
    const { filename } = req.body

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier requis.',
      })
    }

    // Si c'est une URL Cloudinary, extraire le public_id
    let publicId = filename
    if (filename.includes('cloudinary.com')) {
      // Extraire le public_id de l'URL Cloudinary
      const match = filename.match(/\/v\d+\/(.+?)(?:\.[^.]+)?$/)
      if (match) {
        publicId = match[1]
      }
    }

    // Supprimer de Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })

    res.status(200).json({
      success: true,
      message: 'Image supprimée.',
    })
  } catch (error) {
    next(error)
  }
}
