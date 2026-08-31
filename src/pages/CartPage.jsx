import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { resolveImageUrl } from '../lib/resolveImageUrl'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

function CartPage() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart()

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
          <h1 className="text-3xl font-black tracking-[-0.06em] text-[#0f2557] sm:text-4xl">
            Votre panier
          </h1>
          <p className="mt-2 text-slate-600">Gérez vos articles et passez votre commande.</p>
        </div>

        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_18px_40px_rgba(11,31,58,0.04)]">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
              🛒
            </div>
          </div>
          <p className="mt-4 text-2xl font-black text-[#0f2557]">Votre panier est vide</p>
          <p className="mt-2 text-slate-600">Commencez vos achats et découvrez nos produits.</p>

          <Link
            to="/catalogue"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#0f2557] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#1a3a8a]"
          >
            Parcourir le catalogue
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
        <h1 className="text-3xl font-black tracking-[-0.06em] text-[#0f2557] sm:text-4xl">
          Votre panier
        </h1>
        <p className="mt-2 text-slate-600">
          {itemCount} article{itemCount > 1 ? 's' : ''} • {formatPrice(total)}
        </p>
      </div>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <article
              key={item.id}
              className="rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(11,31,58,0.08)]"
            >
              <div className="flex gap-5 p-5 sm:gap-6 sm:p-6">
                <img
                  src={resolveImageUrl(item.image)}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="h-32 w-32 rounded-2xl object-cover sm:h-40 sm:w-40"
                />

                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      {item.subCategory}
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#0f2557]">
                      {item.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.description}</p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Prix unitaire</p>
                      <p className="mt-1 text-2xl font-black text-[#0f2557]">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>

                      <input
                        type="number"
                        min="1"
                        max={item.stock || undefined}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value) || 1)
                          updateQuantity(item.id, Math.min(val, item.stock || val))
                        }}
                        className="h-9 w-12 rounded-lg border border-slate-200 text-center font-bold outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.stock != null && item.quantity >= item.stock}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
                  <p className="mt-1 text-2xl font-black text-[#0f2557]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
              <h3 className="text-lg font-black text-[#0f2557]">Résumé</h3>

              <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Sous-total</span>
                  <span className="font-bold text-[#0f2557]">{formatPrice(total)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Livraison</span>
                  <span className="font-bold text-green-600">Gratuite</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="font-bold text-[#0f2557]">Total</span>
                  <span className="text-3xl font-black text-[#0f2557]">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-6 w-full rounded-2xl bg-[#0f2557] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#1a3a8a]"
              >
                Procéder au paiement
              </button>

              <Link
                to="/catalogue"
                className="mt-3 block rounded-2xl border border-[#0f2557] bg-white px-6 py-4 text-center text-lg font-bold text-[#0f2557] transition hover:bg-slate-50"
              >
                Continuer les achats
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full rounded-2xl border border-red-200 bg-white px-6 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
              >
                Vider le panier
              </button>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
              <h4 className="font-bold text-[#0f2557]">✓ Livraison rapide</h4>
              <p className="mt-2 text-sm text-slate-600">Livraison en 24-48h partout au Sénégal.</p>

              <h4 className="mt-4 font-bold text-[#0f2557]">✓ Paiement sécurisé</h4>
              <p className="mt-2 text-sm text-slate-600">Vos données sont protégées et chiffrées.</p>

              <h4 className="mt-4 font-bold text-[#0f2557]">✓ Support 24/7</h4>
              <p className="mt-2 text-sm text-slate-600">Equipe disponible à tout moment pour vous aider.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
