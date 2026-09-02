import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { logError } from '../lib/logger'
import { getActivePricing } from '../lib/pricing'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('bns_cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Gestion du panier latéral (Drawer)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Gestion de la notification Toast
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    product: null,
  })

  // Animation pour le badge du panier
  const [badgeAnimated, setBadgeAnimated] = useState(false)

  const triggerBadgeAnimation = () => {
    setBadgeAnimated(true)
    setTimeout(() => setBadgeAnimated(false), 600)
  }

  const showToast = (message, product = null) => {
    setToast({ visible: true, message, product })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 2800)
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }))
  }

  useEffect(() => {
    const refreshCartPricing = () => {
      setCart((currentCart) => {
        let changed = false
        const nextCart = currentCart.map((item) => {
          const pricing = getActivePricing(item)
          if (pricing.price !== item.price) {
            changed = true
            return { ...item, ...pricing }
          }
          return item
        })

        if (changed) {
          try {
            localStorage.setItem('bns_cart', JSON.stringify(nextCart))
          } catch (e) {
            logError('Erreur mise à jour des prix du panier:', e)
          }
          showToast('Le prix d’un article a été actualisé après la fin de sa réduction.')
        }
        return changed ? nextCart : currentCart
      })
    }

    const interval = setInterval(refreshCartPricing, 60000)
    return () => clearInterval(interval)
  }, [])

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev)

  const addToCart = (product, quantity = 1, options = {}) => {
    const { openDrawerAfter = false, notify = true } = options

    // Vérification du stock disponible
    const stock = product.stock ?? Infinity
    if (stock <= 0) return

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      const currentQty = existingItem ? existingItem.quantity : 0
      const allowedQty = Math.min(quantity, stock - currentQty)
      if (allowedQty <= 0) return prevCart

      let nextCart
      if (existingItem) {
        nextCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + allowedQty }
            : item
        )
      } else {
        const pricing = getActivePricing(product)
        nextCart = [...prevCart, { ...product, ...pricing, quantity: allowedQty }]
      }
      try {
        localStorage.setItem('bns_cart', JSON.stringify(nextCart))
      } catch (e) {
        logError('Erreur sauvegarde panier:', e)
      }
      return nextCart
    })

    triggerBadgeAnimation()

    if (notify) {
      showToast(`« ${product.name} » a été ajouté au panier !`, product)
    }

    if (openDrawerAfter) {
      setIsDrawerOpen(true)
    }
  }

  const buyNow = (product, quantity = 1) => {
    // Ajoute le produit au panier, ferme le drawer et permet la redirection immédiate
    addToCart(product, quantity, { openDrawerAfter: false, notify: false })
    setIsDrawerOpen(false)
    return true
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const nextCart = prevCart.filter((item) => item.id !== productId)
      try {
        localStorage.setItem('bns_cart', JSON.stringify(nextCart))
      } catch (e) {
        logError('Erreur sauvegarde panier:', e)
      }
      return nextCart
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId)
      const stock = item?.stock ?? Infinity
      const cappedQty = Math.min(quantity, stock)

      const nextCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: cappedQty } : item
      )
      try {
        localStorage.setItem('bns_cart', JSON.stringify(nextCart))
      } catch (e) {
        logError('Erreur sauvegarde panier:', e)
      }
      return nextCart
    })
  }

  const clearCart = () => {
    setCart([])
    try {
      localStorage.removeItem('bns_cart')
    } catch (e) {
      logError('Erreur suppression panier:', e)
    }
  }

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const value = {
    cart,
    addToCart,
    buyNow,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    // Drawer
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    // Toast
    toast,
    showToast,
    hideToast,
    // Badge
    badgeAnimated,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
