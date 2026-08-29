import { z } from 'zod'

// Schéma de validation pour l'inscription client
export const customerRegisterSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'Le prénom est requis.' }).min(2, 'Le prénom doit contenir au moins 2 caractères.'),
    lastName: z.string({ required_error: 'Le nom est requis.' }).min(2, 'Le nom doit contenir au moins 2 caractères.'),
    email: z.string({ required_error: "L'email est requis." }).email('Format d\'adresse email invalide.'),
    phone: z.string().optional(),
    password: z.string({ required_error: 'Le mot de passe est requis.' }).min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  }),
})

// Schéma de validation pour la connexion client
export const customerLoginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "L'email est requis." }).email('Format d\'adresse email invalide.'),
    password: z.string({ required_error: 'Le mot de passe est requis.' }).min(1, 'Le mot de passe est requis.'),
  }),
})

// Schéma pour mot de passe oublié
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "L'email est requis." }).email('Format d\'adresse email invalide.'),
  }),
})

// Schéma pour réinitialisation du mot de passe
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Le jeton de réinitialisation est requis.' }),
    newPassword: z.string({ required_error: 'Le nouveau mot de passe est requis.' }).min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  }),
})
