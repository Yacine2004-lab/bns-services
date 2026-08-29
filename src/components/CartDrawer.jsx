import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { resolveImageUrl } from '../lib/resolveImageUrl'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

export default function CartDrawer() {
  const navigate = useNavigate()
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount
  } = useCart()

  // Ferme le drawer avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeDrawer()
    }
    if (isDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Empêche le scroll en arrière-plan
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen, closeDrawer])

  const handleCheckout = () => {
    closeDrawer()
    navigate('/checkout')
  }

  if (!isDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay sombre avec flou d'arrière-plan */}
      <div
        className="fixed inset-0 bg-[#0f2557]/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <aside
          className="w-screen max-w-full sm:max-w-md md:max-w-lg bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out animate-in slide-in-from-right"
          role="dialog"
          aria-modal="true"
          aria-label="Panier d'achats"
        >
          {/* 1. Header du Panier */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e87722] to-[#e87722] text-[#0f2557] shadow-md shadow-[#e87722]/20">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-[#0f2557]">
                  Mon Panier
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  {itemCount} article{itemCount > 1 ? 's' : ''} sélectionné{itemCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-[#0f2557] transition"
              aria-label="Fermer le panier"
            >
              <X size={20} />
            </button>
          </div>

          {/* 2. Corps du Panier (Articles ou État vide) */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-50 border border-slate-100 text-slate-300 mb-5 shadow-inner">
                  <ShoppingBag size={44} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-[#0f2557]">
                  Votre panier est vide
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-xs">
                  Explorez nos équipements et accessoires informatiques au meilleur prix.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer()
                    navigate('/catalogue')
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f2557] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1a3a8a] hover:shadow-lg"
                >
                  <Sparkles size={16} className="text-[#e87722]" />
                  <span>Découvrir le catalogue</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 group transition-all"
                  >
                    {/* Miniature produit */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-[#f8fafc] p-2 flex items-center justify-center">
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Détails de l'article */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {item.subCategory || item.category || 'Accessoire'}
                          </p>
                          <h4 className="text-sm font-bold text-[#0f2557] line-clamp-1 group-hover:text-[#e87722] transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            {formatPrice(item.price)} / unité
                          </p>
                        </div>

                        {/* Bouton supprimer */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                          title="Supprimer du panier"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Contrôle quantité & Sous-total */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-slate-600 shadow-xs hover:bg-slate-100 hover:text-[#0f2557] transition disabled:opacity-40"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#0f2557]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.stock != null && item.quantity >= item.stock}
                            className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-slate-600 shadow-xs hover:bg-slate-100 hover:text-[#0f2557] transition disabled:opacity-40"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-sm font-black text-[#0f2557]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Footer du Panier (Total & Action Checkout) */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/70 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Sous-total</span>
                  <span className="font-semibold text-slate-800">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Livraison</span>
                  <span className="font-bold text-emerald-600">Gratuite</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                  <span className="text-base font-bold text-[#0f2557]">Total à payer</span>
                  <span className="text-2xl font-black text-[#0f2557]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Bouton Passer la commande */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#e87722] py-4 text-base font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Passer la commande</span>
                <ArrowRight size={18} />
              </button>

              {/* Message rassurant */}
              <div className="flex items-center justify-center gap-4 pt-1 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <Truck size={14} className="text-[#e87722]" />
                  Livraison rapide au Sénégal
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Paiement à la livraison
                </span>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="w-full rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
              >
                Vider le panier
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
