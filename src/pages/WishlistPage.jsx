import { Link } from 'react-router-dom'
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { resolveImageUrl } from '../lib/resolveImageUrl'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (wishlist.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
          <h1 className="text-3xl font-black tracking-[-0.06em] text-[#0b1f3a] sm:text-4xl">
            Mes favoris
          </h1>
          <p className="mt-2 text-slate-600">Vos produits favoris seront sauvegardés ici.</p>
        </div>

        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_18px_40px_rgba(11,31,58,0.04)]">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
              ❤️
            </div>
          </div>
          <p className="mt-4 text-2xl font-black text-[#0b1f3a]">Pas de favoris pour l'instant</p>
          <p className="mt-2 text-slate-600">Ajoutez des produits à votre wishlist en cliquant sur le cœur.</p>

          <Link
            to="/catalogue"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#0b1f3a] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#143765]"
          >
            <ArrowLeft size={18} />
            Découvrir des produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
        <h1 className="text-3xl font-black tracking-[-0.06em] text-[#0b1f3a] sm:text-4xl">
          Mes favoris
        </h1>
        <p className="mt-2 text-slate-600">
          {wishlist.length} produit{wishlist.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(11,31,58,0.08)] transition hover:-translate-y-1"
          >
            <Link
              to={`/produit/${product.slug}`}
              className="relative block"
            >
              <img
                src={resolveImageUrl(product.image)}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="h-48 w-full object-cover transition hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                ❤️ Favori
              </span>
            </Link>

            <div className="space-y-3 p-4">
              <Link to={`/produit/${product.slug}`} className="block">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {product.subCategory}
                </p>
                <h3 className="mt-2 line-clamp-2 text-lg font-black tracking-[-0.04em] text-[#0b1f3a] hover:text-[#f5a623]">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Prix</p>
                  <p className="text-xl font-black text-[#0b1f3a]">{formatPrice(product.price)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="flex-1 rounded-full bg-[#0b1f3a] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#143765]"
                >
                  <ShoppingCart size={16} className="mx-auto" />
                </button>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default WishlistPage
