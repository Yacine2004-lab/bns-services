/** Production API URL on Railway */
const PRODUCTION_API = 'https://bns-api-production.up.railway.app/api'

function normalizeApiUrl(url) {
  if (url.endsWith('/')) url = url.slice(0, -1)
  if (url !== '/api' && !url.endsWith('/api')) url += '/api'
  return url
}

/** URL de base de l'API (avec /api) */
export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) return normalizeApiUrl(import.meta.env.VITE_API_URL)
  if (import.meta.env.PROD) return PRODUCTION_API
  return '/api'
}

/** Origine du backend sans le suffixe /api */
export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api$/, '')
}
