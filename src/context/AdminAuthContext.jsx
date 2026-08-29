import { createContext, useState, useEffect } from 'react'
import { adminAuthApi, setAdminToken, removeAdminToken } from '../lib/api'
import { logError } from '../lib/logger'

// Contexte d'authentification 100% isolé pour l'Espace Administration BNS Services.
// Ce contexte est totalement étanche et indépendant de l'espace client.
const AdminAuthContext = createContext(null)

export { AdminAuthContext }

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Charger la session admin depuis le stockage local
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bns_admin_user')
      if (stored) {
        setAdminUser(JSON.parse(stored))
      }
    } catch {
      localStorage.removeItem('bns_admin_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const loginAdmin = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error('Email et mot de passe requis.')
    }

    // Appel API backend — vérification réelle des identifiants
    const res = await adminAuthApi.login({ email: email.trim(), password })
    const { admin, token } = res.data

    // Stocker le token JWT admin et les données de session
    setAdminToken(token)
    setAdminUser(admin)
    try {
      localStorage.setItem('bns_admin_user', JSON.stringify(admin))
    } catch (e) {
      logError('Erreur sauvegarde session admin:', e)
    }
    return admin
  }

  const logoutAdmin = () => {
    setAdminUser(null)
    removeAdminToken()
    try {
      localStorage.removeItem('bns_admin_user')
    } catch (e) {
      logError('Erreur suppression session admin:', e)
    }
  }

  const isAdminAuthenticated = () => adminUser !== null

  // Permet au dashboard de mettre à jour les données affichées (ex: après modification profil)
  const updateAdminUser = (data) => {
    setAdminUser(data)
    try {
      localStorage.setItem('bns_admin_user', JSON.stringify(data))
    } catch (e) {
      logError('Erreur sauvegarde session admin:', e)
    }
  }

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        setAdminUser: updateAdminUser,
        loading,
        loginAdmin,
        logoutAdmin,
        isAdminAuthenticated,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
