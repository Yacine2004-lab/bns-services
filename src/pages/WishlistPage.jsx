import { Link } from 'react-router-dom'
import { Trash2, ShoppingCart, Heart, ArrowRight, Sparkles } from 'lucide-react'
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
      <div className="space-y-8 pb-16">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2557] via-[#0f2557] to-[#1a3a8a] px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />
          <Sparkles className="absolute right-8 top-8 h-6 w-6 text-white/20" />
          <Heart className="absolute right-10 bottom-10 h-12 w-12 fill-white/10 text-white/10" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white border border-white/20 backdrop-blur-sm">
              <Heart size={11} className="fill-current" /> Mes favoris
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Vos coups de <span className="text-[#e87722]">cœur</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/80 sm:text-base">
              Retrouvez ici tous les produits que vous avez ajoutés à vos favoris.
            </p>
          </div>
        </section>

        {/* EMPTY STATE */}
        <section className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50/50 p-10 text-center sm:p-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-100/30 blur-3xl" />

          <div className="relative">
            <div className="relative mx-auto inline-flex">
              <div className="absolute inset-0 animate-pulse rounded-full bg-red-200/50 blur-2xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-pink-100 text-red-500 sm:h-28 sm:w-28">
                <Heart size={48} className="sm:hidden" />
                <Heart size={56} className="hidden sm:block" />
              </div>
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#0f2557] sm:text-3xl">
              Pas de favoris pour l'instant
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 sm:text-base">
              Ajoutez des produits à votre wishlist en cliquant sur l'icône cœur. Vous pourrez les retrouver ici à tout moment.
            </p>

            <Link
              to="/catalogue"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#e87722]/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
            >
              Découvrir des produits
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-16">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2557] via-[#0f2557] to-[#1a3a8a] px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />
        <Heart className="absolute right-8 top-8 h-12 w-12 fill-white/10 text-white/10" />

        <div className="relative flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white border border-white/20 backdrop-blur-sm">
              <Heart size={11} className="fill-current text-red-300" /> Mes favoris
            </span>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Vos coups de <span className="text-[#e87722]">cœur</span>
            </h1>
            <p className="mt-1 text-sm text-white/80 sm:text-base">
              {wishlist.length} produit{wishlist.length > 1 ? 's' : ''} sauvegardé{wishlist.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Continuer mes achats
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* GRILLE DE FAVORIS */}
      <section className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((product) => (
          <article
            key={product.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <Link to={`/produit/${product.slug}`} className="relative block overflow-hidden">
              <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-red-500/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md backdrop-blur-sm">
                <Heart size={10} className="fill-white" /> Favori
              </div>
              <img
                src={resolveImageUrl(product.image)}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </Link>

            <div className="space-y-3 p-4">
              <Link to={`/produit/${product.slug}`} className="block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {product.subCategory}
                </p>
                <h3 className="mt-1.5 line-clamp-2 text-sm font-black text-[#0f2557] transition hover:text-[#e87722]">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <p className="text-lg font-black text-[#0f2557]">{formatPrice(product.price)}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FCFA</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="group/btn flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#e87722] to-[#f09050] py-2 text-xs font-bold text-white shadow-md shadow-[#e87722]/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                >
                  <ShoppingCart size={13} className="transition-transform group-hover/btn:scale-110" />
                  Ajouter au panier
                </button>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition-all duration-200 hover:scale-[1.05] hover:bg-red-50 active:scale-[0.95]"
                  title="Retirer des favoris"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

    </div>
  )
}

export default WishlistPage
