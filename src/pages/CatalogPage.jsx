import { useMemo, useState } from 'react'
import { SlidersHorizontal, Sparkles, Menu, Zap, Plus, Heart, CheckCircle2, ChevronRight } from 'lucide-react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import CategorySidebar from '../components/CategorySidebar'
import CategoryDrawer from '../components/CategoryDrawer'
import { categories, getSubCategoryMeta } from '../data/categories'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { resolveImageUrl } from '../lib/resolveImageUrl'

const sortOptions = [
  { value: 'featured', label: 'Meilleures ventes' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name', label: 'Nom A-Z' },
]

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

function CatalogPage() {
  const navigate = useNavigate()
  const { products } = useProducts()
  const { addToCart, buyNow } = useCart()
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || null)
  const [activeSubCategory, setActiveSubCategory] = useState(searchParams.get('subcategory') || null)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [addedToast, setAddedToast] = useState(null)

  const handleQuickBuy = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    buyNow(product, 1)
    navigate('/checkout')
  }

  const handleQuickAdd = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setAddedToast(product.id)
    setTimeout(() => {
      setAddedToast(null)
    }, 1800)
  }

  const categoryMeta = useMemo(
    () => categories.find((category) => category.id === activeCategory) || null,
    [activeCategory],
  )

  const subCategoryMeta = useMemo(
    () => (activeSubCategory ? getSubCategoryMeta(activeSubCategory) : null),
    [activeSubCategory],
  )

  const countsBySubCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      category.subCategories.forEach((subCategory) => {
        acc[subCategory.id] = products.filter(
          (product) => product.category === category.name && product.subCategory === subCategory.name,
        ).length
      })
      return acc
    }, {})
  }, [products])

  const countsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = products.filter(
        (product) => product.category === category.name,
      ).length
      return acc
    }, {})
  }, [products])

  const visibleProducts = useMemo(() => {
    let filtered = [...products]

    if (activeCategory) {
      filtered = filtered.filter((product) => product.category === categoryMeta?.name)
    }

    if (activeSubCategory && subCategoryMeta) {
      filtered = filtered.filter((product) => product.subCategory === subCategoryMeta.name)
    }

    if (query.trim()) {
      const normalized = query.trim().toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(normalized) ||
          (product.description || '').toLowerCase().includes(normalized) ||
          (product.reference || '').toLowerCase().includes(normalized),
      )
    }

    filtered = filtered.filter((product) => product.price >= 0)

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      filtered.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name))
    }

    return filtered
  }, [products, activeCategory, activeSubCategory, categoryMeta, subCategoryMeta, query, sortBy])

  const applyCategory = (categoryId) => {
    const nextCategory = categoryId || null
    setActiveCategory(nextCategory)
    setActiveSubCategory(null)

    if (nextCategory) {
      setSearchParams({ category: nextCategory })
    } else {
      setSearchParams({})
    }
  }

  const applySubCategory = (subCategoryId) => {
    const nextMeta = getSubCategoryMeta(subCategoryId)
    setActiveSubCategory(subCategoryId)
    setActiveCategory(nextMeta?.categoryId || null)

    if (nextMeta) {
      setSearchParams({ category: nextMeta.categoryId, subcategory: nextMeta.id })
    }
  }

  const resetFilters = () => {
    setActiveCategory(null)
    setActiveSubCategory(null)
    setQuery('')
    setSortBy('featured')
    setSearchParams({})
  }

  const title = subCategoryMeta ? subCategoryMeta.name : categoryMeta?.name || 'Tous nos produits'
  const subtitle = subCategoryMeta
    ? `${subCategoryMeta.categoryName} • ${subCategoryMeta.name}`
    : categoryMeta?.description || 'Des solutions tech pensée pour le quotidien.'

  return (
    <div className="space-y-6 pb-10">
      <CategoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCategory={applyCategory}
        onSelectSubCategory={applySubCategory}
      />

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(11,31,58,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fef3d6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#a66600]">
              <Sparkles size={12} />
              Catalogue premium
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[#0f2557] sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#0f2557] transition hover:border-[#e87722]/40 hover:bg-[#fff7eb]"
            >
              <Menu size={16} />
              Catégories
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#0f2557] transition hover:border-[#e87722]/40 hover:bg-[#fff7eb]"
            >
              <SlidersHorizontal size={16} />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        <CategorySidebar
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          onSelectCategory={applyCategory}
          onSelectSubCategory={applySubCategory}
          counts={countsBySubCategory}
          categoryCounts={countsByCategory}
        />

        <section className="space-y-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(11,31,58,0.08)] sm:p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <div>
                <label htmlFor="catalog-search" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Recherche
                </label>
                <input
                  id="catalog-search"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#e87722] focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="catalog-sort" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Trier par
                </label>
                <select
                  id="catalog-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#e87722] focus:bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-slate-600">
              {visibleProducts.length} produit{visibleProducts.length > 1 ? 's' : ''} trouvé{visibleProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Toast de confirmation d'ajout */}
          {addedToast && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#0f2557] px-5 py-3.5 text-white shadow-2xl transition-all animate-bounce">
              <CheckCircle2 size={20} className="text-[#e87722]" />
              <span className="text-sm font-semibold">Produit ajouté au panier !</span>
              <Link
                to="/panier"
                className="rounded-lg bg-[#e87722] px-2.5 py-1 text-xs font-bold text-[#0f2557] hover:bg-white transition"
              >
                Voir
              </Link>
            </div>
          )}

          {visibleProducts.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_18px_40px_rgba(11,31,58,0.04)]">
              <p className="text-xl font-black text-[#0f2557]">Aucun produit ne correspond à ce filtre.</p>
              <p className="mt-2 text-sm text-slate-600">Essayez une autre catégorie ou réinitialisez les filtres.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => {
                const inWish = isInWishlist(product.id)
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(11,31,58,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#e87722]/40 hover:shadow-[0_22px_44px_rgba(11,31,58,0.12)]"
                  >
                    <div className="relative">
                      <Link to={`/produit/${product.slug}`} className="block">
                        <img
                          src={resolveImageUrl(product.image)}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="h-52 w-full object-cover transition group-hover:scale-105"
                        />
                      </Link>
                      {product.featured && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#e87722] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0f2557]">
                          Top Vente
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleWishlist(product)
                        }}
                        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-110 ${
                          inWish ? 'border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500'
                        }`}
                        aria-label="Ajouter aux favoris"
                      >
                        <Heart size={16} className={inWish ? 'fill-current' : ''} />
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          {product.subCategory}
                        </p>
                        <Link
                          to={`/produit/${product.slug}`}
                          className="mt-1 block text-lg font-black tracking-tight text-[#0f2557] transition hover:text-[#e87722]"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="mb-3 flex items-baseline justify-between">
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Prix</p>
                          <p className="text-2xl font-black tracking-tight text-[#0f2557]">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        {/* ACTIONS DIRECTES : ACHETER & AJOUTER PANIER */}
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={(e) => handleQuickBuy(product, e)}
                            className="group/btn w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#f09050] py-2.5 text-sm font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#e87722]/35 active:scale-[0.98]"
                          >
                            <Zap size={16} className="fill-[#0f2557] transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
                            <span>Acheter maintenant</span>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={(e) => handleQuickAdd(product, e)}
                              className="group/add flex items-center justify-center gap-1.5 rounded-xl border-2 border-slate-200/80 bg-white py-2 text-xs font-bold text-[#0f2557] transition-all duration-300 hover:border-[#e87722] hover:bg-[#e87722]/5 active:scale-[0.97]"
                            >
                              <Plus size={14} className="transition-transform duration-300 group-hover/add:scale-125" />
                              <span>Panier</span>
                            </button>

                            <Link
                              to={`/produit/${product.slug}`}
                              className="flex items-center justify-center gap-1 rounded-xl border-2 border-slate-200/80 bg-white py-2 text-xs font-bold text-slate-600 transition-all duration-300 hover:border-slate-300 hover:text-[#0f2557] hover:bg-slate-50"
                            >
                              <span>Détails</span>
                              <ChevronRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default CatalogPage
