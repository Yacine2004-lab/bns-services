import { z } from 'zod'

// Schéma de validation pour la création d'un produit
export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Le nom du produit est requis.' }).min(2, 'Le nom doit contenir au moins 2 caractères.'),
    description: z.string({ required_error: 'La description est requise.' }).min(5, 'La description doit contenir au moins 5 caractères.'),
    price: z.coerce.number({ required_error: 'Le prix est requis.' }).positive('Le prix doit être un nombre positif.'),
    image: z.string({ required_error: "L'image du produit est requise." }).min(5, "L'URL de l'image est requise."),
    images: z.array(z.string()).max(8).optional(),
    reference: z.string().min(2).optional(), // Auto-générée si non fournie
    stock: z.coerce.number().int().min(0, 'Le stock ne peut pas être négatif.').default(0),
    categoryId: z.string({ required_error: 'La catégorie est requise.' }),
    subCategoryId: z.string({ required_error: 'La sous-catégorie est requise.' }),
    featured: z.boolean().optional().default(false),
  }),
})

// Schéma de validation pour la modification d'un produit
export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    price: z.coerce.number().positive().optional(),
    image: z.string().min(5).optional(),
    images: z.array(z.string()).max(8).optional(),
    reference: z.string().min(2).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    featured: z.boolean().optional(),
  }),
})
