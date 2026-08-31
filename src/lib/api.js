// Utilitaire centralisé d'appels API vers le backend BNS Services

import { getApiBaseUrl } from './config.js'

const API_BASE_URL = getApiBaseUrl()

// Clé de stockage du token client JWT
const TOKEN_KEY = 'bns_client_token'
const ADMIN_TOKEN_KEY = 'bns_admin_token'

// --------------------------------------------------------
// Gestion du Token JWT
// --------------------------------------------------------
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function removeAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

// --------------------------------------------------------
// Requête HTTP générique avec gestion d'erreurs
// --------------------------------------------------------
async function request(endpoint, options = {}) {
  const { _adminToken, ...fetchOptions } = options
  const token = _adminToken || getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || `Erreur serveur : ${response.status}`)
  }

  return data
}

// --------------------------------------------------------
// API — Authentification Client
// --------------------------------------------------------
export const authApi = {
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (userData) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  getMe: () => request('/auth/me'),

  forgotPassword: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token, newPassword) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  updateProfile: (data) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  changePassword: (data) =>
    request('/auth/password', { method: 'PUT', body: JSON.stringify(data) }),

  deleteAccount: () => request('/auth/account', { method: 'DELETE' }),

  // Statut des providers OAuth (utilise pour activer/desactiver les boutons social login)
  getOAuthStatus: () => request('/auth/oauth-status'),
}

// --------------------------------------------------------
// API — Catalogue Produits
// --------------------------------------------------------
export const productsApi = {
  // Lecture : routes publiques, pas besoin de token admin
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/products${query ? `?${query}` : ''}`)
  },

  getBySlug: (slug) => request(`/products/${slug}`),

  // Écriture : protégées par requireAdminAuth → token admin obligatoire
  create: (data) =>
    adminRequest('/products', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    adminRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    adminRequest(`/products/${id}`, { method: 'DELETE' }),
}

// --------------------------------------------------------
// API — Catégories & Sous-catégories
// --------------------------------------------------------
export const categoriesApi = {
  getAll: () => request('/categories'),
  getById: (id) => request(`/categories/${id}`),
  getSubCategories: (categoryId) =>
    request(`/subcategories${categoryId ? `?categoryId=${categoryId}` : ''}`),
}

// --------------------------------------------------------
// API — Commandes
// --------------------------------------------------------
export const ordersApi = {
  create: (orderData) =>
    request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),

  getMyOrders: (page = 1) => request(`/orders/my-orders?page=${page}`),

  getByNumber: (orderNumber) => request(`/orders/${orderNumber}`),

  cancel: (orderNumber) =>
    request(`/orders/${orderNumber}/cancel`, { method: 'PATCH' }),
}

// --------------------------------------------------------
// API — Administration (token admin isolé)
// --------------------------------------------------------
function adminRequest(endpoint, options = {}) {
  const token = getAdminToken()
  return request(endpoint, { ...options, _adminToken: token }).catch((err) => {
    // Si le token admin est refusé (401), nettoyer la session automatiquement
    if (err.message && (
      err.message.includes('Autorisation') ||
      err.message.includes('autorisation') ||
      err.message.includes('expirée') ||
      err.message.includes('refusé') ||
      err.message.includes('401')
    )) {
      removeAdminToken()
      localStorage.removeItem('bns_admin_user')
      // Redirection vers le login admin si on n'y est pas déjà
      if (!window.location.pathname.startsWith('/admin/connexion')) {
        window.location.href = '/admin/connexion'
      }
    }
    throw err
  })
}

export const adminAuthApi = {
  login: (credentials) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify(credentials) }),

  getMe: () => adminRequest('/admin/me'),

  forgotPassword: (email) =>
    request('/admin/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token, newPassword) =>
    request('/admin/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
}

export const adminOrdersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return adminRequest(`/admin/orders${query ? `?${query}` : ''}`)
  },

  updateStatus: (id, status) =>
    adminRequest(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}

export const adminCustomersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return adminRequest(`/admin/customers${query ? `?${query}` : ''}`)
  },

  getDetails: (id) => adminRequest(`/admin/customers/${id}`),
}

export const adminSettingsApi = {
  get: () => adminRequest('/admin/settings'),
  updateProfile: (data) =>
    adminRequest('/admin/settings/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data) =>
    adminRequest('/admin/settings/password', { method: 'PUT', body: JSON.stringify(data) }),
}

// Upload d'images produit (FormData, pas JSON)
export const uploadApi = {
  /**
   * Upload des images vers le serveur.
   * @param {FileList|File[]} files - Fichiers images à uploader
   * @param {function} onProgress - Callback optionnel (pourcentage de progression)
   * @returns {Promise} Résout avec les URLs optimisées des images
   */
  images: async (files, onProgress) => {
    const formData = new FormData()
    Array.from(files).forEach((file) => {
      formData.append('images', file)
    })

    const token = getAdminToken()
    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Ne PAS mettre Content-Type : le navigateur le fait automatiquement avec le boundary multipart
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'upload des images.")
    }

    return data
  },

  /**
   * Supprimer une image du serveur.
   * @param {string} filename - Nom du fichier à supprimer
   */
  delete: (filename) =>
    adminRequest('/admin/upload', { method: 'DELETE', body: JSON.stringify({ filename }) }),
}
