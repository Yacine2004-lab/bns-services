import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

// ----------------------------------------------------
// 1. TOKENS CLIENTS
// ----------------------------------------------------
export function generateCustomerToken(customer) {
  return jwt.sign(
    {
      id: customer.id,
      email: customer.email,
      role: 'customer',
    },
    env.jwtCustomerSecret,
    { expiresIn: env.jwtExpiresIn },
  )
}

export function verifyCustomerToken(token) {
  return jwt.verify(token, env.jwtCustomerSecret)
}

// ----------------------------------------------------
// 2. TOKENS ADMINISTRATEURS (ISOLÉS)
// ----------------------------------------------------
export function generateAdminToken(adminUser) {
  return jwt.sign(
    {
      id: adminUser.id,
      email: adminUser.email,
      role: 'admin',
    },
    env.jwtAdminSecret,
    { expiresIn: env.jwtExpiresIn },
  )
}

export function verifyAdminToken(token) {
  return jwt.verify(token, env.jwtAdminSecret)
}
