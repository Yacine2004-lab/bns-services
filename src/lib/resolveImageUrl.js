// Utilitaire de résolution d'URLs pour les images produits
// Les images locales (/uploads/...) sont résolues en URL complète vers le backend

import { getApiOrigin } from './config.js'

const API_BASE = getApiOrigin()

/**
 * Résoudre une URL image en URL absolue utilisable dans <img src>.
 * - URLs externes (http/https) → retournées telles quelles
 * - Data URLs (base64) → retournées telles quelles
 * - Chemins locaux (/uploads/...) → convertis en URL complète backend
 */
export function resolveImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`
}
