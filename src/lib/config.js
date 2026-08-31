const PRODUCTION_API = 'https://bns-api-production.up.railway.app/api'

/** URL de base de l'API (avec /api) */
export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (import.meta.env.PROD) return PRODUCTION_API
  return '/api'
}

/** Origine du backend sans le suffixe /api */
export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api$/, '')
}
