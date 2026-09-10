import { getApiOrigin } from './config.js'

const API_BASE = getApiOrigin()

const LEGACY_ORIGINS = [
  'http://169.58.37.124:3006',
  'https://169.58.37.124:3006',
  'https://bns-api-production.up.railway.app',
  'http://bns-api-production.up.railway.app',
]

/**
 * Résoudre une URL image en URL utilisable dans <img src>.
 * Les anciennes URLs HTTP (VPS / Railway) sont converties en chemins same-origin
 * pour éviter le mixed content et les 404.
 */
export function resolveImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('data:')) return url

  for (const origin of LEGACY_ORIGINS) {
    if (url.startsWith(origin)) {
      const path = url.slice(origin.length)
      return path.startsWith('/') ? path : `/${path}`
    }
  }

  if (url.startsWith('http')) return url
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`
}
