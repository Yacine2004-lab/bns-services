const PRODUCTION_API = 'https://bns-api-production.up.railway.app/api'

/** URL de base de l'API (avec /api) */
export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    let url = import.meta.env.VITE_API_URL;
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url.endsWith('/api')) url += '/api';
    return url;
  }
  if (import.meta.env.PROD) return PRODUCTION_API
  return '/api'
}

/** Origine du backend sans le suffixe /api */
export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api$/, '')
}
