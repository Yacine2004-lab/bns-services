import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Plus, CheckCircle2, ShieldCheck, Truck, Headphones } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { getActivePricing } from '../lib/pricing'
import { allSubCategories } from '../data/categories'
import { resolveImageUrl } from '../lib/resolveImageUrl'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

const promoStyles = [
  'from-[#e87722]/12 via-white/80 to-white/90',
  'from-[#0f2557]/5 via-white/80 to-white/90',
  'from-[#1a3a8a]/10 via-white/80 to-white/90',
  'from-[#e87722]/8 via-white/75 to-[#edf1fa]/90',
  'from-[#0f2557]/4 via-white/80 to-white/90',
  'from-[#1a3a8a]/8 via-white/75 to-[#e87722]/6',
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
    <div className="space-y-20 pb-10 w-full overflow-x-hidden">
      {/* Toast de confirmation */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#0f2557] px-5 py-3.5 text-white shadow-2xl transition-all animate-bounce">
          <CheckCircle2 size={20} className="text-emerald-400" />
          <span className="text-sm font-semibold">Produit ajouté au panier !</span>
          <Link
            to="/panier"
            className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-[#0f2557] hover:bg-slate-100 transition"
          >
            Voir
          </Link>
        </div>
      )}

      {/* 1. Hero carousel */}
      {currentHero && (
        <section className="relative isolate overflow-hidden rounded-[20px] border border-white/15 bg-[#091a3d] shadow-[0_24px_70px_rgba(15,37,87,0.28)] sm:rounded-[28px] lg:rounded-[36px]">
          {/* Magnifique photo de fond */}
          <div
            className="absolute inset-0 z-0 scale-105 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80)' }}
          />
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_78%_42%,rgba(232,119,34,0.34),transparent_24%),linear-gradient(110deg,rgba(4,16,42,0.98)_0%,rgba(11,29,68,0.9)_48%,rgba(27,16,72,0.58)_100%)]" />
          <div className="pointer-events-none absolute -right-24 top-1/2 z-0 h-80 w-80 -translate-y-1/2 rounded-full border border-white/10 bg-[#e87722]/10 blur-2xl" />

          <div className="relative z-10 grid items-center gap-4 p-4 sm:min-h-[470px] sm:gap-8 sm:p-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:p-14">
            <div className="space-y-3 sm:space-y-6">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.16em] text-slate-300 sm:gap-3 sm:text-[10px] sm:tracking-[0.2em]">
                <span className="h-px w-8 bg-slate-400/60" />
                <span>La technologie qui avance avec vous</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs">
                  {currentHero.subCategory}
                </span>
                <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-black text-white backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-xs sm:font-black">
                  {formatPrice(currentHero.price)}
                </span>
              </div>

              <h1 className="max-w-xl text-[1.8rem] font-black leading-[1.02] tracking-[-0.04em] text-white drop-shadow-lg sm:text-[2.5rem] md:text-5xl lg:text-[4.1rem]">
                {currentHero.name}
              </h1>
              <p className="max-w-md text-[11px] leading-5 text-slate-200/80 sm:text-sm sm:leading-6">
                Des équipements fiables, sélectionnés pour rendre chaque journée de travail plus simple et plus performante.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 sm:gap-4 sm:pt-4">
                <button
                  type="button"
                  onClick={() => handleQuickBuy(currentHero)}
                  className="group/btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#e87722] px-3 py-2.5 text-[9px] font-black text-white shadow-[0_8px_25px_rgba(232,119,34,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f09050] hover:shadow-[0_12px_35px_rgba(232,119,34,0.5)] active:scale-95 sm:gap-2 sm:px-6 sm:py-3 sm:text-[10px] md:px-8 md:py-4 md:text-sm"
                >
                  <Zap size={16} className="fill-white transition-transform duration-300 group-hover/btn:-rotate-12 group-hover/btn:scale-110 sm:size-18" />
                  Commander maintenant
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(currentHero)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[10px] font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/20 active:scale-95 sm:gap-2 sm:px-8 sm:py-4 sm:text-sm"
                >
                  <Plus size={18} />
                  Panier
                </button>
                <Link
                  to={`/produit/${currentHero.slug}`}
                  className="pl-1 text-[11px] font-bold text-slate-300 transition-colors hover:text-white hover:underline sm:pl-2 sm:text-sm"
                >
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Conteneur image avec halo de lumière */}
            <div className="relative flex items-center justify-center py-1 sm:py-4 lg:py-6">
              {/* Halo lumineux derrière l'image */}
              <div className="absolute inset-0 bg-[#e87722]/15 blur-[80px] rounded-full scale-75" />
              <img
                key={currentHero.id}
                src={resolveImageUrl(currentHero.image)}
                alt={currentHero.name}
                className="relative z-10 max-h-[150px] w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-2 hover:scale-105 sm:max-h-[280px] md:max-h-[360px] lg:max-h-[410px]"
              />
            </div>
          </div>

          {/* Pagination */}
          {heroSlides.length > 1 && (
            <div className="relative z-10 flex justify-center gap-3 pb-7">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === heroIndex
                      ? 'h-2 w-10 bg-[#e87722] shadow-[0_0_10px_rgba(232,119,34,0.8)]'
                      : 'h-2 w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

        </section>
      )}

      <section className="grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/80 shadow-sm sm:grid-cols-3">
        {[
          { icon: Truck, title: 'Livraison suivie', text: 'Recevez vos achats en toute sérénité.' },
          { icon: ShieldCheck, title: 'Paiement sécurisé', text: 'Des transactions protégées à chaque étape.' },
          { icon: Headphones, title: 'Conseil personnalisé', text: 'Une équipe disponible avant et après votre achat.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4 bg-white/80 px-5 py-4 backdrop-blur-sm sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f2557] text-[#f09050]">
              <Icon size={19} />
            </div>
            <div>
              <p className="text-sm font-black text-[#0f2557]">{title}</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </section>


      {/* 2. Categories populaires avec photos reelles */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-[#0f2557] sm:text-3xl">
            Nos categories populaires
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Decouvrez nos equipements et accessoires informatiques soigneusement selectionnes
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9">
          {topCategories.map((sub) => {
            const Icon = sub.icon
            return (
              <Link
                key={sub.id}
                to={`/catalogue?subcategory=${sub.id}`}
                className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border border-white/60 bg-gradient-to-br from-slate-50 to-white p-3 text-center shadow-lg shadow-slate-200/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0f2557]/10 sm:p-4 sm:gap-3"
            >
              {/* Conteneur photo réelle du produit */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#0f2557]/8 blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative flex h-16 w-16 sm:h-16 sm:w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-200 bg-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#0f2557]/30">
                  {sub.image ? (
                    <img
                      src={resolveImageUrl(sub.image)}
                      alt={sub.name}
                      className="h-full w-full object-cover rounded-xl"
                      loading="lazy"
                    />
                  ) : (
                    <Icon size={22} className="text-[#0f2557] sm:size-26" />
                  )}
                </div>

                <div className="relative w-full space-y-1">
                  <p className="line-clamp-2 text-[11px] font-bold leading-tight text-[#0f2557] transition-colors group-hover:text-[#1a3a8a] sm:text-xs">
                    {sub.name}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
                    <span className="h-1 w-1 rounded-full bg-current" />
                    {sub.count} article{sub.count > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0f2557] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
                  <ArrowRight size={10} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 3. Grille promotions (bento 3×2) - version premium */}
      <section className="space-y-8 w-full overflow-hidden">
        <div className="flex flex-col items-center text-center space-y-3 sm:flex-row sm:justify-between sm:text-left sm:items-end">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0f2557]/15 bg-gradient-to-r from-[#0f2557]/8 via-white to-[#1a3a8a]/5 px-4 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0f2557]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f2557]">Selection du moment</span>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-[#0f2557] sm:text-4xl">
              Offres a <span className="bg-gradient-to-r from-[#e87722] to-[#f09050] bg-clip-text text-transparent">saisir</span>
            </h2>
          </div>
          <Link
            to="/catalogue"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-[#0f2557] shadow-sm transition-all hover:border-[#0f2557] hover:bg-[#0f2557]/5 hover:shadow-md"
          >
            Voir tout le catalogue
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 w-full">
        {promoProducts.map((product, index) => (
          (() => {
            const pricing = getActivePricing(product)
            return (
          <div
            key={product.id}
            className={`group relative flex flex-col sm:flex-row justify-between min-h-[200px] overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${promoStyles[index % promoStyles.length]} p-6 shadow-[0_8px_30px_rgba(11,31,58,0.05)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(11,31,58,0.12)]`}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/40 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
            <div className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-[#e87722]/10 blur-xl" />
            <div className="relative z-10 flex flex-1 flex-col sm:flex-row gap-4 sm:gap-6 items-center">
              {/* Text */}
              <div className="flex-1 flex flex-col justify-center w-full">
                <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0f2557] px-2.5 py-0.5 shadow-sm">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white">
                    {promoLabels[index % promoLabels.length]}
                  </span>
                </div>
                <Link to={`/produit/${product.slug}`} className="block">
                  <h3 className="mt-1.5 text-lg font-black leading-snug text-[#0f2557] transition hover:text-[#e87722] sm:text-xl line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                {pricing.isPromoActive && (
                  <span className="mt-2 inline-flex w-fit rounded-full bg-[#1a3a8a] px-2 py-0.5 text-[10px] font-black text-white">
                    -{pricing.promoPercentage}%
                  </span>
                )}
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#0f2557] sm:text-3xl">
                    {formatPrice(pricing.price)}
                  </span>
                  {pricing.isPromoActive && <span className="text-sm text-slate-400 line-through whitespace-nowrap">{formatPrice(pricing.originalPrice)}</span>}
                </div>
              </div>

              {/* Image */}
              <div className="relative w-full sm:w-[200px] lg:w-[300px] flex-shrink-0 flex items-center justify-center h-[160px] sm:h-[180px] lg:h-[200px]">
                <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-75 transition-all duration-500 group-hover:scale-100 group-hover:bg-white/60" />
                <Link to={`/produit/${product.slug}`} className="relative block w-full h-full flex items-center justify-center">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain drop-shadow-lg transition duration-500 group-hover:scale-110 group-hover:-rotate-3"
                  />
                </Link>
              </div>
            </div>

            {/* Boutons en bas */}
            <div className="relative z-10 flex items-center justify-between gap-3 border-t border-[#0f2557]/10 pt-4 mt-4">
              <button
                type="button"
                onClick={() => handleQuickBuy(product)}
                className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#e87722] to-[#f09050] px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-white shadow-md shadow-[#e87722]/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-[#e87722]/40 active:scale-[0.97] whitespace-nowrap"
              >
                <Zap size={14} className="fill-white transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
                Acheter
              </button>
              <Link
                to={`/produit/${product.slug}`}
                className="group inline-flex items-center gap-1 text-xs font-bold text-[#0f2557] transition-colors hover:text-[#1a3a8a] whitespace-nowrap"
              >
                Détails
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
            )
          })()
        ))}
        </div>
      </section>

      {/* 4. Produits tendance — onglets + slider */}
      <section className="space-y-8 w-full overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0f2557]/15 bg-gradient-to-r from-[#0f2557]/8 via-white to-[#1a3a8a]/5 px-4 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0f2557]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f2557]">Le meilleur de BNS</span>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-[#0f2557] sm:text-4xl">
              Nos produits <span className="bg-gradient-to-r from-[#e87722] to-[#f09050] bg-clip-text text-transparent">tendance</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6 lg:gap-10">
            <div className="flex flex-wrap gap-6 sm:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'text-[#0f2557]'
                      : 'text-slate-500 hover:text-[#0f2557]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#0f2557]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollTrending('left')}
                aria-label="Produits précédents"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-[#0f2557] backdrop-blur-sm transition hover:border-[#0f2557]/40 hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => scrollTrending('right')}
                aria-label="Produits suivants"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-[#0f2557] backdrop-blur-sm transition hover:border-[#0f2557]/40 hover:bg-white"
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
              className="group relative flex w-[230px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-md shadow-slate-200/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#0f2557]/30 hover:shadow-[0_20px_45px_rgba(15,37,87,0.12)] sm:w-[250px]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#0f2557]/8 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <Link to={`/produit/${product.slug}`} className="block">
                <div className="relative flex h-48 items-center justify-center bg-[#f8fafc] p-4">
                  {product.featured && (
                    <span className="absolute left-3 top-3 rounded-md bg-[#0f2557] px-2 py-0.5 text-[10px] font-black uppercase text-white">
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
                    className="line-clamp-1 block text-sm font-bold text-[#0f2557] transition hover:text-[#1a3a8a]"
                  >
                    {product.name}
                  </Link>
                  <p className="pt-1 text-base font-black text-[#0f2557]">{formatPrice(product.price)}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickBuy(product)}
                    className="group/btn w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#f09050] py-2 text-xs font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#e87722]/35 active:scale-[0.97]"
                  >
                    Acheter maintenant
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className="group/add w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-slate-200/80 bg-white py-1.5 text-xs font-bold text-slate-700 transition-all duration-300 hover:border-[#0f2557] hover:bg-[#0f2557]/5 active:scale-[0.97]"
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
