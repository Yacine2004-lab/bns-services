import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '../config/prisma.js'
import { generateCustomerToken } from '../utils/jwt.js'
import { sendPasswordResetEmail } from '../utils/mailer.js'

// 1. Inscription d'un nouveau client
export async function register(req, res, next) {
  try {
    const { firstName, lastName, email, phone, password } = req.body

    const cleanEmail = email.trim().toLowerCase()

    // Vérifier si l'email existe déjà
    const existing = await prisma.customer.findUnique({
      where: { email: cleanEmail },
    })

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Un compte avec cette adresse email existe déjà.',
      })
    }

    // Hachage sécurisé du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Création du client en base
    const customer = await prisma.customer.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    })

    // Génération du token JWT
    const token = generateCustomerToken(customer)

    res.status(201).json({
      success: true,
      message: 'Compte client créé avec succès !',
      data: {
        customer,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// 2. Connexion d'un client
export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const cleanEmail = email.trim().toLowerCase()

    // Trouver le client
    const customer = await prisma.customer.findUnique({
      where: { email: cleanEmail },
    })

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.',
      })
    }

    // Comparer le mot de passe avec le hash
    const isMatch = await bcrypt.compare(password, customer.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.',
      })
    }

    // Générer le token JWT
    const token = generateCustomerToken(customer)

    const customerData = {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
    }

    res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      data: {
        customer: customerData,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// 3. Récupérer le profil du client connecté (Route protégée)
export async function getMe(req, res, next) {
  try {
    // req.customer a été injecté par le middleware requireCustomerAuth
    const customerId = req.customer.id

    const [customer, orderCount] = await Promise.all([
      prisma.customer.findUnique({
        where: { id: customerId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      }),
      prisma.order.count({
        where: { customerId },
      }),
    ])

    res.status(200).json({
      success: true,
      data: {
        ...customer,
        orderCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

// 4. Demande de mot de passe oublié
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body
    const cleanEmail = email.trim().toLowerCase()

    const customer = await prisma.customer.findUnique({
      where: { email: cleanEmail },
    })

    if (!customer) {
      // Pour des raisons de sécurité, ne pas divulguer si l'email existe ou non
      return res.status(200).json({
        success: true,
        message: 'Si un compte existe avec cette adresse email, un lien de réinitialisation vous a été envoyé.',
      })
    }

    // Génération d'un jeton aléatoire sécurisé valide 1 heure
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetPasswordExpires = new Date(Date.now() + 3600000) // 1h

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    })

    // Envoi de l'email de réinitialisation
    try {
      await sendPasswordResetEmail(cleanEmail, resetToken, 'client')
    } catch (mailError) {
      console.error('Erreur envoi email reset password :', mailError.message)
      // En dev, on retourne quand même le token pour faciliter les tests
    }

    res.status(200).json({
      success: true,
      message: 'Instructions de réinitialisation envoyées.',
      devResetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    })
  } catch (error) {
    next(error)
  }
}

// 5. Réinitialisation du mot de passe avec le jeton
export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body

    const customer = await prisma.customer.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() },
      },
    })

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Le jeton de réinitialisation est invalide ou a expiré.',
      })
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })

    res.status(200).json({
      success: true,
      message: 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.',
    })
  } catch (error) {
    next(error)
  }
}
