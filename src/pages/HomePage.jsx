import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Plus, CheckCircle2 } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { allSubCategories } from '../data/categories'
import { resolveImageUrl } from '../lib/resolveImageUrl'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

const promoStyles = [
  'from-[#f5a623]/14 via-white/80 to-white/90',
  'from-[#0b1f3a]/6 via-white/80 to-white/90',
  'from-[#60a5fa]/12 via-white/80 to-white/90',
  'from-[#f5a623]/10 via-white/75 to-[#eef4fb]/90',
  'from-[#0b1f3a]/5 via-white/80 to-white/90',
  'from-[#60a5fa]/10 via-white/75 to-[#f5a623]/8',
]

const promoLabels = ['GROSSE ÉCONOMIE', 'MEILLEUR PRIX', 'SÉLECTION', 'NOUVEAUTÉ', 'TOP VENTE', 'OFFRE SPÉCIALE']

const tabs = [
  { id: 'new', label: 'Nouveautés' },
  { id: 'best', label: 'Meilleures ventes' },
  { id: 'featured', label: 'Produits vedettes' },
]

function HomePage() {
  const navigate = useNavigate()
  const { products } = useProducts()
  const { addToCart, buyNow } = useCart()
  const [heroIndex, setHeroIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('featured')
  const [addedToast, setAddedToast] = useState(null)
  const trendRef = useRef(null)

  const handleQuickBuy = (product, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    buyNow(product, 1)
    navigate('/checkout')
  }

  const handleQuickAdd = (product, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    addToCart(product, 1)
    setAddedToast(product.id)
    setTimeout(() => {
      setAddedToast(null)
    }, 1800)
  }

  const featuredProducts = useMemo(() => products.filter((p) => p.featured), [products])
  const heroSlides = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3)
  const promoProducts = products.slice(0, 6)

  const tabProducts = useMemo(() => {
    if (activeTab === 'new') {
      return [...products].slice(-8).reverse()
    }
    if (activeTab === 'best') {
      return [...products].sort((a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price)
    }
    return featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8)
  }, [activeTab, products, featuredProducts])

  const topCategories = useMemo(() => {
    return allSubCategories
      .map((sub) => ({
        ...sub,
        count: products.filter((p) => p.subCategory === sub.name).length,
      }))
      .filter((sub) => sub.count > 0)
      .slice(0, 9)
  }, [products])

  useEffect(() => {
    if (heroSlides.length <= 1) return
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const scrollTrending = (direction) => {
    if (!trendRef.current) return
    const amount = direction === 'left' ? -320 : 320
    trendRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const currentHero = heroSlides[heroIndex]

  return (
    <div className="space-y-16 pb-10">
      {/* Toast de confirmation */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#0b1f3a] px-5 py-3.5 text-white shadow-2xl transition-all animate-bounce">
          <CheckCircle2 size={20} className="text-[#f5a623]" />
          <span className="text-sm font-semibold">Produit ajouté au panier !</span>
          <Link
            to="/panier"
            className="rounded-lg bg-[#f5a623] px-2.5 py-1 text-xs font-bold text-[#0b1f3a] hover:bg-white transition"
          >
            Voir
          </Link>
        </div>
      )}

      {/* 1. Hero carousel */}
      {currentHero && (
        <section className="relative overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(11,31,58,0.2)]">
          {/* Magnifique photo de fond */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80)' }}
          />
          {/* Overlay sombre/dégradé pour rendre le texte super lisible */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/40 backdrop-blur-[2px]" />

          <div className="relative z-10 grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
            <div className="space-y-6">
              {/* Catégorie et Prix avec un joli style au lieu des tirets */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                  {currentHero.subCategory}
                </span>
                <span className="px-4 py-1.5 text-xs sm:text-sm font-black text-[#0b1f3a] bg-[#f5a623] rounded-full border border-[#f5a623]/30 shadow-[0_0_15px_rgba(245,166,35,0.4)]">
                  {formatPrice(currentHero.price)}
                </span>
              </div>

              <h1 className="text-4xl font-black leading-[1.1] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.6rem] drop-shadow-lg">
                {currentHero.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => handleQuickBuy(currentHero)}
                  className="group/btn inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f5a623] to-[#FFB84D] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-[#0b1f3a] shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_35px_rgba(245,166,35,0.5)] active:scale-95"
                >
                  <Zap size={18} className="fill-[#0b1f3a] transition-transform duration-300 group-hover/btn:-rotate-12 group-hover/btn:scale-110" />
                  Commander maintenant
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(currentHero)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40 active:scale-95"
                >
                  <Plus size={18} />
                  Panier
                </button>
                <Link
                  to={`/produit/${currentHero.slug}`}
                  className="pl-2 text-sm font-bold text-slate-300 transition-colors hover:text-white underline-offset-4 hover:underline"
                >
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Conteneur image avec halo de lumière */}
            <div className="relative flex items-center justify-center py-6">
              {/* Halo lumineux derrière l'image */}
              <div className="absolute inset-0 bg-[#f5a623]/20 blur-[80px] rounded-full scale-75" />
              <img
                key={currentHero.id}
                src={resolveImageUrl(currentHero.image)}
                alt={currentHero.name}
                className="relative z-10 max-h-[360px] sm:max-h-[420px] w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-105 hover:-translate-y-2"
              />
            </div>
          </div>

          {/* Pagination */}
          {heroSlides.length > 1 && (
            <div className="relative z-10 flex justify-center gap-3 pb-8">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === heroIndex
                      ? 'h-2 w-10 bg-[#f5a623] shadow-[0_0_10px_rgba(245,166,35,0.8)]'
                      : 'h-2 w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 2. Catégories populaires avec photos réelles */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-[#0b1f3a] sm:text-3xl">
            Nos catégories populaires
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Découvrez nos équipements et accessoires informatiques soigneusement sélectionnés
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {topCategories.map((sub) => {
            const Icon = sub.icon
            return (
              <Link
                key={sub.id}
                to={`/catalogue?subcategory=${sub.id}`}
                className="group flex flex-col items-center justify-between rounded-2xl border border-slate-200/70 bg-white/90 p-3 text-center shadow-[0_4px_20px_rgba(11,31,58,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#f5a623]/60 hover:shadow-[0_14px_35px_rgba(245,166,35,0.18)]"
              >
                {/* Conteneur photo réelle du produit */}
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-xl bg-[#f8fafc] p-1.5 transition-all duration-300 group-hover:bg-amber-50/60 border border-slate-100">
                  {sub.image ? (
                    <img
                      src={resolveImageUrl(sub.image)}
                      alt={sub.name}
                      className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <Icon size={26} className="text-[#0b1f3a]" />
                  )}
                </div>

                <div className="mt-2.5 w-full">
                  <p className="line-clamp-2 text-xs font-bold leading-tight text-[#0b1f3a] transition-colors group-hover:text-[#f5a623]">
                    {sub.name}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                    {sub.count} article{sub.count > 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 3. Grille promotions (bento 3×2) */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {promoProducts.map((product, index) => (
          <div
            key={product.id}
            className={`group relative flex flex-col justify-between min-h-[250px] overflow-hidden rounded-[20px] border border-white/60 bg-gradient-to-br ${promoStyles[index % promoStyles.length]} p-6 shadow-[0_8px_30px_rgba(11,31,58,0.05)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(11,31,58,0.1)]`}
          >
            <div className="relative z-10 flex flex-1 gap-4">
              {/* Text */}
              <div className="flex-1 flex flex-col justify-start">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f5a623]">
                  {promoLabels[index % promoLabels.length]}
                </span>
                <Link to={`/produit/${product.slug}`} className="block">
                  <h3 className="mt-1.5 text-lg font-black leading-snug text-[#0b1f3a] transition hover:text-[#f5a623] sm:text-xl line-clamp-3">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-1.5 text-sm font-semibold text-slate-600">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Image */}
              <div className="w-[120px] sm:w-[150px] flex-shrink-0 flex items-center justify-center">
                <Link to={`/produit/${product.slug}`} className="block w-full">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    className="max-h-[150px] w-full object-contain drop-shadow-md transition duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </div>

            {/* Boutons en bas */}
            <div className="relative z-10 mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuickBuy(product)}
                className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#f5a623] to-[#FFB84D] px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-[#0b1f3a] shadow-md shadow-[#f5a623]/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-[#f5a623]/40 active:scale-[0.97] whitespace-nowrap"
              >
                <Zap size={14} className="fill-[#0b1f3a] transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
                Acheter
              </button>
              <Link
                to={`/produit/${product.slug}`}
                className="text-xs font-bold text-[#0b1f3a] transition-colors hover:text-[#f5a623] whitespace-nowrap"
              >
                Détails →
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Produits tendance — onglets + slider */}
      <section className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-[#0b1f3a] sm:text-3xl">
            Nos produits tendance
          </h2>

          <div className="flex flex-wrap items-center gap-6 lg:gap-10">
            <div className="flex flex-wrap gap-6 sm:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'text-[#0b1f3a]'
                      : 'text-slate-500 hover:text-[#0b1f3a]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#f5a623]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollTrending('left')}
                aria-label="Produits précédents"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-[#0b1f3a] backdrop-blur-sm transition hover:border-[#f5a623]/40 hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => scrollTrending('right')}
                aria-label="Produits suivants"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-[#0b1f3a] backdrop-blur-sm transition hover:border-[#f5a623]/40 hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={trendRef}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabProducts.map((product) => (
            <div
              key={product.id}
              className="group flex w-[230px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#f5a623]/40 hover:shadow-[0_16px_40px_rgba(11,31,58,0.1)] sm:w-[250px]"
            >
              <Link to={`/produit/${product.slug}`} className="block">
                <div className="relative flex h-48 items-center justify-center bg-[#f8fafc] p-4">
                  {product.featured && (
                    <span className="absolute left-3 top-3 rounded-md bg-[#f5a623] px-2 py-0.5 text-[10px] font-black uppercase text-[#0b1f3a]">
                      Vedette
                    </span>
                  )}
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              <div className="flex flex-1 flex-col justify-between space-y-3 border-t border-slate-100 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {product.subCategory}
                  </p>
                  <Link
                    to={`/produit/${product.slug}`}
                    className="line-clamp-1 block text-sm font-bold text-[#0b1f3a] transition hover:text-[#f5a623]"
                  >
                    {product.name}
                  </Link>
                  <p className="pt-1 text-base font-black text-[#0b1f3a]">{formatPrice(product.price)}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickBuy(product)}
                    className="group/btn w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f5a623] via-[#f7b733] to-[#FFB84D] py-2 text-xs font-bold text-[#0b1f3a] shadow-lg shadow-[#f5a623]/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#f5a623]/35 active:scale-[0.97]"
                  >
                    <Zap size={13} className="fill-[#0b1f3a] transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
                    Acheter maintenant
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className="group/add w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-slate-200/80 bg-white py-1.5 text-xs font-bold text-slate-700 transition-all duration-300 hover:border-[#f5a623] hover:bg-[#f5a623]/5 active:scale-[0.97]"
                  >
                    <Plus size={13} className="transition-transform duration-300 group-hover/add:scale-125" />
                    Panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
