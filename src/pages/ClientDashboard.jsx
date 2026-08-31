import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Package,
  Heart,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  Plus,
  ArrowRight,
  LogOut,
  Sparkles,
  Search,
  ExternalLink,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useProducts } from '../hooks/useProducts'
import { ordersApi } from '../lib/api'
import { resolveImageUrl } from '../lib/resolveImageUrl'

const STATUS_CONFIG = {
  PENDING:   { label: 'En attente',   color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: Clock },
  CONFIRMED: { label: 'Confirmée',    color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    icon: CheckCircle2 },
  SHIPPED:   { label: 'En livraison', color: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  icon: Package },
  DELIVERED: { label: 'Livrée',       color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
  CANCELLED: { label: 'Annulée',      color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     icon: XCircle },
}

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

export default function ClientDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cart, addToCart, buyNow, itemCount } = useCart()
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist()
  const { products } = useProducts()

  const [activeTab, setActiveTab] = useState('shop') // 'shop' | 'orders' | 'wishlist' | 'profile'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [addedToast, setAddedToast] = useState(null)
  const [orders, setOrders] = useState([])

  // Charger les commandes du client via l'API + auto-refresh temps reel
  const loadOrders = useCallback(() => {
    if (!user) return
    ordersApi
      .getMyOrders(1)
      .then((res) => {
        setOrders(res.data || [])
      })
      .catch(() => {
        setOrders([])
      })
  }, [user])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Polling temps reel : refresh commandes toutes les 20s
  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => {
      if (!document.hidden) loadOrders()
    }, 20000)
    return () => clearInterval(interval)
  }, [user, loadOrders])

  // Refresh quand l'onglet redevient visible
  useEffect(() => {
    if (!user) return
    const handleVisibility = () => {
      if (!document.hidden) loadOrders()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [user, loadOrders])

  // Filtrer les produits pour l'achat express
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCat = selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCat
    })
  }, [products, searchQuery, selectedCategory])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    return ['all', ...cats]
  }, [products])

  const handleQuickBuy = (product) => {
    buyNow(product, 1)
    navigate('/checkout')
  }

  const handleQuickAdd = (product) => {
    addToCart(product, 1)
    setAddedToast(product.id)
    setTimeout(() => {
      setAddedToast(null)
    }, 1800)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Toast notification */}
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

      {/* 1. Header Profil Client */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-r from-[#0f2557] via-[#142d60] to-[#0f2557] p-8 text-white shadow-[0_20px_60px_rgba(11,31,58,0.15)]">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#e87722]/20 blur-[90px]" />
        <div className="absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-[#5b9fd4]/20 blur-[80px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e87722] via-[#e87722] to-[#d06a1a] text-3xl font-black text-[#0f2557] shadow-lg">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Bonjour, {user?.firstName || 'Client'} {user?.lastName || ''} !
                </h1>
                <span className="rounded-full bg-[#e87722]/20 px-3 py-0.5 text-xs font-bold text-[#e87722] border border-[#e87722]/40">
                  Client BNS
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                {user?.email} {user?.phone ? `• ${user.phone}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/panier"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition hover:bg-white/20"
            >
              <ShoppingBag size={18} className="text-[#e87722]" />
              <span>Panier ({itemCount})</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-xs text-slate-400">Commandes passées</p>
            <p className="mt-1 text-2xl font-black text-white">{orders.length}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-xs text-slate-400">Articles en favoris</p>
            <p className="mt-1 text-2xl font-black text-[#e87722]">{wishlist.length}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-xs text-slate-400">Dans le panier</p>
            <p className="mt-1 text-2xl font-black text-white">{itemCount} article(s)</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-xs text-slate-400">Assistance WhatsApp</p>
            <a
              href="https://wa.me/221784459510"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-green-400 hover:underline"
            >
              <MessageCircle size={16} /> Contacter
            </a>
          </div>
        </div>
      </div>

      {/* 2. Onglets du Dashboard */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
            activeTab === 'shop'
              ? 'bg-[#0f2557] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap size={18} className={activeTab === 'shop' ? 'text-[#e87722]' : ''} />
          Commander des produits
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-[#0f2557] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package size={18} />
          Mes Commandes ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
            activeTab === 'wishlist'
              ? 'bg-[#0f2557] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart size={18} className={activeTab === 'wishlist' ? 'text-red-400' : ''} />
          Mes Favoris ({wishlist.length})
        </button>
      </div>

      {/* 3. Contenu de l'onglet actif */}

      {/* ONGLET 1 : COMMANDER DES PRODUITS (ACHAT DIRECT) */}
      {activeTab === 'shop' && (
        <div className="space-y-6">
          {/* Barre de recherche & filtres rapides */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(11,31,58,0.04)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit à commander immédiatement..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm outline-none transition focus:border-[#e87722] focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      selectedCategory === cat
                        ? 'bg-[#e87722] text-[#0f2557]'
                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'all' ? 'Toutes les catégories' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grille des produits avec bouton direct Commander */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const inWish = isInWishlist(product.id)
              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_14px_35px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#e87722]/40 hover:shadow-[0_20px_45px_rgba(11,31,58,0.12)]"
                >
                  {/* Image & Badges */}
                  <div className="relative flex h-52 items-center justify-center bg-gradient-to-b from-slate-50 to-[#f8fafc] p-6">
                    <img
                      src={resolveImageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                    />

                    {product.featured && (
                      <span className="absolute left-3.5 top-3.5 rounded-full bg-[#e87722] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#0f2557]">
                        Vedette
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className={`absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-110 ${
                        inWish ? 'border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500'
                      }`}
                      aria-label="Ajouter aux favoris"
                    >
                      <Heart size={16} className={inWish ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {/* Détails produit */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {product.category} • {product.subCategory}
                      </p>
                      <Link
                        to={`/produit/${product.slug}`}
                        className="mt-1 block font-bold text-[#0f2557] transition hover:text-[#e87722] line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-2 text-2xl font-black tracking-tight text-[#0f2557]">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {/* ACTIONS DIRECTES : ACHETER & AJOUTER PANIER */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleQuickBuy(product)}
                        className="group/btn w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#f09050] py-3 text-sm font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#e87722]/40 active:scale-[0.98]"
                      >
                        <Zap size={16} className="fill-[#0f2557] transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
                        <span>Acheter maintenant</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(product)}
                          className="group/add flex items-center justify-center gap-1.5 rounded-xl border-2 border-slate-200/80 bg-white py-2.5 text-xs font-bold text-[#0f2557] transition-all duration-300 hover:border-[#e87722] hover:bg-[#e87722]/5 active:scale-[0.97]"
                        >
                          <Plus size={14} className="transition-transform duration-300 group-hover/add:scale-125" />
                          <span>Panier</span>
                        </button>

                        <Link
                          to={`/produit/${product.slug}`}
                          className="flex items-center justify-center gap-1 rounded-xl border-2 border-slate-200/80 bg-white py-2.5 text-xs font-bold text-slate-600 transition-all duration-300 hover:border-slate-300 hover:text-[#0f2557] hover:bg-slate-50"
                        >
                          <span>Détails</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-lg font-bold text-slate-700">Aucun produit ne correspond à votre recherche.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#0f2557] px-4 py-2 text-xs font-bold text-white"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      )}

      {/* ONGLET 2 : MES COMMANDES */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0f2557]">Vous n'avez pas encore passé de commande</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                Dès que vous passez une commande sur BNS Services, elle apparaîtra ici avec son statut et son récapitulatif détaillé.
              </p>
              <button
                onClick={() => setActiveTab('shop')}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e87722] px-6 py-3 font-bold text-[#0f2557] hover:bg-[#f09050] transition shadow-lg shadow-[#e87722]/20"
              >
                <Zap size={18} /> Découvrir les produits
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(11,31,58,0.06)]"
                >
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-[#0f2557]">{order.orderNumber || order.id}</span>
                        {(() => {
                          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
                          const Icon = cfg.icon
                          return (
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                              <Icon size={12} /> {cfg.label}
                            </span>
                          )
                        })()}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-500">Montant total</p>
                      <p className="text-2xl font-black text-[#0f2557]">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  {/* Articles de la commande */}
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Articles commandés</p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                        >
                          <img
                            src={resolveImageUrl(item.productImage)}
                            alt={item.productName}
                            loading="lazy"
                            decoding="async"
                            className="h-14 w-14 rounded-xl object-cover bg-white p-1"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#0f2557] truncate">{item.productName}</p>
                            <p className="text-[11px] text-slate-500">
                              Quantité : <strong className="text-slate-700">{item.quantity}</strong> • {formatPrice(item.productPrice)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coordonnées & Suivi */}
                  <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-[#0f2557]">Livraison à :</span> {order.customerName} — {order.shippingAddress}, {order.shippingCity} ({order.customerPhone})
                    </div>
                    <a
                      href={`https://wa.me/221784459510?text=${encodeURIComponent(
                        `Bonjour BNS Services, je souhaite faire le suivi de ma commande ${order.orderNumber || order.id}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700 shadow-sm"
                    >
                      <MessageCircle size={14} />
                      Suivre sur WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ONGLET 3 : MES FAVORIS */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlist.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-400 mb-4">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0f2557]">Votre liste d'envies est vide</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                Ajoutez des produits à vos favoris en cliquant sur l'icône de cœur pour les retrouver et les commander en un clic.
              </p>
              <button
                onClick={() => setActiveTab('shop')}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f2557] px-6 py-3 font-bold text-white hover:bg-[#1a3a8a] transition"
              >
                Parcourir les produits
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(11,31,58,0.06)]"
                >
                  <div className="relative flex h-44 items-center justify-center bg-slate-50 rounded-2xl p-4">
                    <img
                      src={resolveImageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-sm"
                    >
                      <Heart size={16} className="fill-current" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <h4 className="font-bold text-[#0f2557] truncate">{product.name}</h4>
                    <p className="text-xl font-black text-[#0f2557]">{formatPrice(product.price)}</p>

                    <button
                      type="button"
                      onClick={() => handleQuickBuy(product)}
                      className="group/btn w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#f09050] py-2.5 text-xs font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#e87722]/35 active:scale-[0.97]"
                    >
                      <Zap size={14} className="fill-[#0f2557] transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
                      Acheter maintenant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
