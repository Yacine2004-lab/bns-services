/**
 * analytics.js — BNS Services
 * Module centralisé pour Google Analytics 4 (GA4)
 *
 * Toutes les fonctions vérifient que :
 *  1. Le visiteur a donné son consentement (localStorage "bns_cookie_consent" === "true")
 *  2. La fonction gtag() est disponible (script chargé dans index.html)
 *
 * Devise utilisée : XOF (Franc CFA)
 */

const CURRENCY = 'XOF'

/** Retourne true si le visiteur a accepté les cookies analytiques */
function hasConsent() {
  try {
    return localStorage.getItem('bns_cookie_consent') === 'true'
  } catch {
    return false
  }
}

/** Appelle gtag() si disponible et consenti */
function sendEvent(eventName, params = {}) {
  if (!hasConsent()) return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

// ---------------------------------------------------------------------------
// view_item — Déclenché quand un client consulte une fiche produit
// ---------------------------------------------------------------------------
/**
 * @param {object} product  - Objet produit du store
 * @param {number} price    - Prix actif (après promo si applicable)
 */
export function gaViewItem(product, price) {
  sendEvent('view_item', {
    currency: CURRENCY,
    value: price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category || '',
        price: price,
        quantity: 1,
      },
    ],
  })
}

// ---------------------------------------------------------------------------
// add_to_cart — Déclenché quand un client ajoute un article au panier
// ---------------------------------------------------------------------------
/**
 * @param {object} product  - Objet produit
 * @param {number} price    - Prix unitaire actif
 * @param {number} quantity - Quantité ajoutée
 */
export function gaAddToCart(product, price, quantity = 1) {
  sendEvent('add_to_cart', {
    currency: CURRENCY,
    value: price * quantity,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category || '',
        price: price,
        quantity: quantity,
      },
    ],
  })
}

// ---------------------------------------------------------------------------
// begin_checkout — Déclenché quand un client arrive sur la page checkout
// ---------------------------------------------------------------------------
/**
 * @param {Array}  cartItems - Tableau des articles du panier (depuis CartContext)
 * @param {number} total     - Total panier hors livraison
 */
export function gaBeginCheckout(cartItems, total) {
  sendEvent('begin_checkout', {
    currency: CURRENCY,
    value: total,
    items: cartItems.map((item) => ({
      item_id: String(item.id),
      item_name: item.name,
      item_category: item.category || item.subCategory || '',
      price: item.price,
      quantity: item.quantity,
    })),
  })
}

// ---------------------------------------------------------------------------
// purchase — Déclenché quand une commande est confirmée avec succès
// ---------------------------------------------------------------------------
/**
 * @param {string|number} transactionId - Numéro ou ID de commande
 * @param {number}        value         - Montant total payé (livraison incluse)
 * @param {Array}         orderItems    - Articles de la commande (depuis l'API ou le cart)
 *                                         Doit avoir .id/.productId, .name/.productName, .price, .quantity
 */
export function gaPurchase(transactionId, value, orderItems = []) {
  sendEvent('purchase', {
    transaction_id: String(transactionId),
    currency: CURRENCY,
    value: value,
    items: orderItems.map((item) => ({
      item_id: String(item.productId || item.id),
      item_name: item.productName || item.name,
      item_category: item.category || item.subCategory || '',
      price: item.unitPrice || item.price || 0,
      quantity: item.quantity,
    })),
  })
}
