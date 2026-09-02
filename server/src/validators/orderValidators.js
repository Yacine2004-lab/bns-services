import { z } from 'zod'

// Schéma de validation pour la création d'une commande
export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().optional(),
          slug: z.string().optional(),
          quantity: z.coerce.number().int().min(1, 'La quantité minimale par article est de 1.'),
        }),
      )
      .min(1, 'Votre panier doit contenir au moins un article pour passer commande.'),
    customerName: z.string({ required_error: 'Le nom complet est requis.' }).min(2, 'Le nom complet doit contenir au moins 2 caractères.'),
    customerPhone: z.string({ required_error: 'Le numéro de téléphone est requis.' }).min(7, 'Le numéro de téléphone est trop court.'),
    customerEmail: z.string().email('Format email invalide.').optional().or(z.literal('')),
    shippingAddress: z.string({ required_error: "L'adresse de livraison est requise." }).min(3, "L'adresse de livraison est trop courte."),
    shippingCity: z.string({ required_error: 'La zone ou ville de livraison est requise.' }).min(2, 'La ville est requise.'),
    shippingNotes: z.string().optional().or(z.literal('')),
    paymentMethod: z.enum(['CASH_ON_DELIVERY', 'WAVE', 'ORANGE_MONEY']).optional().default('CASH_ON_DELIVERY'),
  }),
})

// Schéma de validation pour la modification du statut d'une commande (Admin)
export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
      required_error: 'Le statut de la commande est requis.',
    }),
  }),
})
