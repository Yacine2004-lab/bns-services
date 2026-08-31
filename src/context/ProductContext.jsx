import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { productsApi } from '../lib/api'
import { logError } from '../lib/logger'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [ready, setReady] = useState(false)
  // Charger les produits depuis l'API backend + auto-refresh temps reel
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productsApi.getAll({ limit: 200 })
        setProducts(res.data || [])
      } catch (err) {
        logError('Erreur chargement produits :', err)
        try {
          const stored = localStorage.getItem('bns_products')
          if (stored) setProducts(JSON.parse(stored))
        } catch { setProducts([]) }
      } finally {
        setReady(true)
      }
    }

    loadProducts()

    // Polling temps reel : refresh produits toutes les 30s
    const interval = setInterval(() => {
      if (!document.hidden) loadProducts()
    }, 30000)

    // Refresh quand l'onglet redevient visible
    const handleVisibility = () => {
      if (!document.hidden) loadProducts()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  // Rafraîchir les produits depuis l'API
  const refreshProducts = useCallback(async () => {
    try {
      const res = await productsApi.getAll({ limit: 200 })
      setProducts(res.data || [])
    } catch (err) {
      logError('Erreur rafraîchissement produits :', err)
    }
  }, [])

  // Ajout d'un produit via l'API (espace admin)
  const addProduct = useCallback(async (data) => {
    const res = await productsApi.create(data)
    setProducts((prev) => [res.data, ...prev])
    return res.data
  }, [])

  // Modification d'un produit via l'API (espace admin)
  const updateProduct = useCallback(async (id, data) => {
    const res = await productsApi.update(id, data)
    setProducts((prev) => prev.map((p) => (p.id === res.data.id ? res.data : p)))
  }, [])

  // Suppression d'un produit via l'API (espace admin)
  const deleteProduct = useCallback(async (id) => {
    await productsApi.delete(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <ProductContext.Provider
      value={{ products, ready, addProduct, updateProduct, deleteProduct, refreshProducts }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProductStore() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProductStore doit être utilisé dans un ProductProvider')
  return ctx
}
