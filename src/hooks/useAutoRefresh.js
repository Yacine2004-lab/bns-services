import { useEffect, useRef, useCallback } from 'react'

/**
 * Hook de rafraichissement automatique en temps reel
 * Re-fetch les donnees a intervalle regulier sans recharger la page
 * @param {Function} fetchFn - Fonction async qui fetch les donnees
 * @param {number} interval - Intervalle en ms (defaut: 15000 = 15s)
 * @param {boolean} enabled - Actif ou non (defaut: true)
 */
export function useAutoRefresh(fetchFn, interval = 15000, enabled = true) {
  const intervalRef = useRef(null)
  const fetchFnRef = useRef(fetchFn)
  fetchFnRef.current = fetchFn

  const refresh = useCallback(() => {
    fetchFnRef.current()
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Refresh immediat au montage
    refresh()

    // Puis refresh periodique
    intervalRef.current = setInterval(refresh, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval, refresh])

  // Refresh quand la page redevient visible (switch d'onglet)
  useEffect(() => {
    if (!enabled) return

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [enabled, refresh])
}
