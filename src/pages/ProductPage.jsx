import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Heart, Check, Zap, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { resolveImageUrl } from '../lib/resolveImageUrl'
import { getActivePricing } from '../lib/pricing'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getProductBySlug } = useProducts()
  const { addToCart, buyNow } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const product = getProductBySlug(slug)
  const inWishlist = product ? isInWishlist(product.id) : false
  const pricing = product ? getActivePricing(product) : null
  const gallery = product?.images && product.images.length ? product.images : [product?.image].filter(Boolean)
  const [selectedImage, setSelectedImage] = useState('')

  // Met à jour l'image sélectionnée quand le produit charge
  useEffect(() => {
    if (gallery[0] && !selectedImage) {
      setSelectedImage(gallery[0])
    }
  }, [gallery[0], selectedImage])

  if (!product) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#0f2557] hover:text-[#1a3a8a]"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
          <p className="text-2xl font-black text-[#0f2557]">Produit introuvable</p>
          <p className="mt-2 text-slate-600">Le produit que vous cherchez n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, { openDrawerAfter: true, notify: true })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    buyNow(product, quantity)
    navigate('/checkout')
  }



  const specs = [
    { label: 'Référence', value: product.reference },
    { label: 'Catégorie', value: product.category },
  ]

  return (
    <div className="space-y-6 sm:space-y-10 pb-8 sm:pb-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#0f2557] transition hover:bg-white"
      >
        <ArrowLeft size={14} className="sm:size-16" />
        Retour au catalogue
      </button>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
        <div className="h-fit lg:sticky lg:top-24">
          <div className="relative rounded-[20px] sm:rounded-[28px] border border-slate-200 bg-white p-3 sm:p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
            <img
              src={resolveImageUrl(selectedImage || product.image)}
              alt={product.name}
              className="h-64 sm:h-80 lg:h-96 w-full rounded-[16px] sm:rounded-[20px] object-contain bg-slate-50"
            />
            {pricing?.isPromoActive && (
              <span className="absolute left-3 sm:left-10 top-3 sm:top-10 rounded-full bg-[#1a3a8a] px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-sm font-black text-white">
                -{pricing.promoPercentage}%
              </span>
            )}

            {gallery.length > 1 && (
              <div className="mt-3 sm:mt-4 grid grid-cols-4 gap-2 sm:gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === image ? 'border-[#0f2557]' : 'border-slate-200'
                    }`}
                  >
                    <img src={resolveImageUrl(image)} alt={`${product.name} ${index + 1}`} loading="lazy" decoding="async" className="h-16 sm:h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-[20px] sm:rounded-[28px] border border-slate-200 bg-white p-3 sm:p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
            <span className="inline-block rounded-full bg-[#fef3d6] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#a66600]">
              {product.category}
            </span>

            <h1 className="mt-2 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.06em] text-[#0f2557]">
              {product.name}
            </h1>

            <p className="mt-2 sm:mt-3 text-base sm:text-xl text-slate-600">
              {product.description}
            </p>

            <div className="mt-4 sm:mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500">Prix</p>
              <div className="mt-1.5 sm:mt-2 flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.06em] text-[#0f2557]">
                  {formatPrice(pricing.price)}
                </p>
                {pricing.isPromoActive && <p className="text-sm sm:text-lg font-semibold text-slate-400 line-through whitespace-nowrap">{formatPrice(pricing.originalPrice)}</p>}
              </div>
            </div>

            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="product-quantity" className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-bold text-[#0f2557]">
                  Quantité
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock === 0}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  >
                    −
                  </button>

                  <input
                    id="product-quantity"
                    type="number"
                    min="1"
                    max={product.stock || 1}
                    value={quantity}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1)
                      setQuantity(Math.min(val, product.stock || 1))
                    }}
                    disabled={product.stock === 0}
                    className="h-9 w-14 sm:h-11 sm:w-16 rounded-xl border border-slate-200 text-center text-base sm:text-lg font-bold outline-none disabled:opacity-40"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(quantity + 1, product.stock || 1))}
                    disabled={product.stock === 0 || quantity >= product.stock}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* BOUTON COMMANDER DIRECTEMENT */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/30 transition hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{product.stock === 0 ? 'Indisponible' : 'Acheter maintenant (Commander)'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  isAdded
                    ? 'bg-green-600 text-white'
                    : 'bg-[#0f2557] text-white hover:bg-[#1a3a8a]'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <ShoppingCart size={16} className="sm:size-20" />
                  {isAdded ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => product && toggleWishlist(product)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold transition ${
                  inWishlist
                    ? 'bg-brand-100 text-[#0f2557] hover:bg-brand-200'
                    : 'border border-[#0f2557] bg-white text-[#0f2557] hover:bg-slate-50'
                }`}
              >
                <Heart size={16} className={`sm:size-20 ${inWishlist ? 'fill-current' : ''}`} />
                {inWishlist ? 'Enlever des favoris' : 'Ajouter à la wishlist'}
              </button>
            </div>
          </div>

          <div className="rounded-[20px] sm:rounded-[28px] border border-slate-200 bg-white p-3 sm:p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
            <h3 className="text-base sm:text-xl font-black text-[#0f2557]">Caractéristiques</h3>

            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between border-b border-slate-100 pb-2 sm:pb-3">
                  <span className="text-sm sm:font-medium text-slate-600">{spec.label}</span>
                  <span className="text-sm sm:font-bold text-[#0f2557]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default ProductPage
