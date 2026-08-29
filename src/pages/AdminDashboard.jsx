import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/useAdminAuth'
import { useProductStore } from '../context/ProductContext'
import { adminOrdersApi } from '../lib/api'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Star,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  RefreshCw,
  Search,
  Save,
  Shield,
  Eye,
  EyeOff,
  Server,
  Database,
  Activity,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import AdminProducts from '../components/admin/AdminProducts'
import { adminCustomersApi, adminSettingsApi } from '../lib/api'
import { resolveImageUrl } from '../lib/resolveImageUrl'
import { logError } from '../lib/logger'

const formatPrice = (val) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val)

const STATUS_CONFIG = {
  PENDING:    { label: 'En attente',   color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20',   icon: Clock },
  CONFIRMED:  { label: 'Confirmée',    color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20',    icon: CheckCircle2 },
  SHIPPED:    { label: 'En livraison', color: 'text-indigo-400',  bg: 'bg-indigo-400/10',  border: 'border-indigo-400/20',  icon: Truck },
  DELIVERED:  { label: 'Livrée',       color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: CheckCircle2 },
  CANCELLED:  { label: 'Annulée',      color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/20',     icon: XCircle },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  )
}

// ================================================================
// ROUTE PROTECTION
// ================================================================
function AdminRoute({ children }) {
  const { adminUser, isAdminAuthenticated, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
          <p className="text-sm text-slate-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!adminUser || !isAdminAuthenticated()) {
    return <Navigate to="/admin/connexion" replace />
  }

  return children
}

// ================================================================
// SIDEBAR
// ================================================================
function AdminSidebar({ isOpen, onClose, onLogout, activeItem, onNavigate, adminUser }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', id: 'dashboard' },
    { icon: Package, label: 'Produits', id: 'products' },
    { icon: ShoppingCart, label: 'Commandes', id: 'orders' },
    { icon: Users, label: 'Clients', id: 'customers' },
    { icon: Settings, label: 'Paramètres', id: 'settings' },
  ]

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-slate-950 transition-transform duration-300 ease-in-out lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-800/60 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f9b448] to-[#f5a623] text-lg font-black text-[#0b1f3a] shadow-lg shadow-[#f5a623]/20">
              B
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white">BNS Services</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#f5a623]/70">Panel Admin</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">Menu principal</p>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#f5a623]/10 text-[#f5a623]'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute -left-0.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#f5a623]" />
                )}
                <Icon size={18} className={isActive ? 'text-[#f5a623]' : 'text-slate-500 group-hover:text-slate-300'} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Admin info + Déconnexion */}
        <div className="border-t border-slate-800/60 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-900/60 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f5a623] to-[#e78b0a] text-xs font-black text-[#0b1f3a]">
              {adminUser?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{adminUser?.name || 'Administrateur'}</p>
              <p className="truncate text-[11px] text-slate-500">{adminUser?.email || 'admin@bnsservices.sn'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  )
}

// ================================================================
// DASHBOARD OVERVIEW
// ================================================================
function DashboardOverview({ onNavigate }) {
  const { products } = useProductStore()
  const featuredCount = products.filter((p) => p.featured).length
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5)
  const outOfStockProducts = products.filter((p) => p.stock === 0)

  const [ordersCount, setOrdersCount] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)
  const [recentOrders, setRecentOrders] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadOrders = useCallback(() => {
    setRefreshing(true)
    Promise.all([
      adminOrdersApi.getAll({ limit: 1 }),
      adminOrdersApi.getAll({ limit: 100 }),
    ])
      .then(([countRes, allRes]) => {
        setOrdersCount(countRes.total || 0)
        const allOrders = allRes.data || []
        const revenue = allOrders
          .filter((o) => o.status !== 'CANCELLED')
          .reduce((sum, o) => sum + (o.total || 0), 0)
        setTotalRevenue(revenue)
        setPendingOrders(allOrders.filter((o) => o.status === 'PENDING').length)
        setRecentOrders(allOrders.slice(0, 5))
      })
      .catch((err) => logError('Erreur chargement commandes admin :', err))
      .finally(() => setRefreshing(false))
  }, [])

  // Chargement initial + à chaque refreshKey
  useEffect(() => {
    loadOrders()
  }, [loadOrders, refreshKey])

  // Re-fetch automatique quand l'onglet redevient visible
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) setRefreshKey((k) => k + 1)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Polling temps réel : re-fetch toutes les 30s (pause si onglet caché)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) setRefreshKey((k) => k + 1)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      label: 'Produits',
      value: String(products.length),
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/20',
    },
    {
      label: 'En vedette',
      value: String(featuredCount),
      icon: Star,
      color: 'from-amber-500 to-amber-600',
      glow: 'shadow-amber-500/20',
    },
    {
      label: 'Commandes',
      value: String(ordersCount),
      subtitle: pendingOrders > 0 ? `${pendingOrders} en attente` : null,
      icon: ShoppingCart,
      color: 'from-emerald-500 to-emerald-600',
      glow: 'shadow-emerald-500/20',
    },
    {
      label: "Chiffre d'affaires",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/20',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Tableau de bord</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              En direct
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Vue d'ensemble de votre boutique BNS Services
            {refreshing && <span className="ml-2 text-[#f5a623]">Mise à jour...</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
            title="Rafraichir les données"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#0b1f3a] shadow-lg shadow-[#f5a623]/20 transition hover:bg-[#f9b448] hover:shadow-xl"
          >
            <Package size={16} />
            Gérer les produits
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/80 p-5 transition-all duration-300 hover:border-slate-700/60 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-[11px] font-semibold text-amber-400">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.glow}`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alertes stock */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-400" />
            <h3 className="text-sm font-bold text-amber-300">Alertes stock</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {outOfStockProducts.length > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 border border-red-400/20">
                <XCircle size={14} />
                {outOfStockProducts.length} produit{outOfStockProducts.length > 1 ? 's' : ''} en rupture
              </div>
            )}
            {lowStockProducts.length > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 border border-amber-400/20">
                <AlertTriangle size={14} />
                {lowStockProducts.length} produit{lowStockProducts.length > 1 ? 's' : ''} en stock faible (≤ 5)
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/60 px-3 py-1.5 text-[11px] font-medium text-slate-300"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${p.stock === 0 ? 'bg-red-400' : 'bg-amber-400'}`} />
                {p.name}
                <span className="text-slate-500">({p.stock})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Commandes récentes */}
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/80">
        <div className="flex items-center justify-between border-b border-slate-800/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-[#f5a623]" />
            <h3 className="text-sm font-bold text-white">Commandes récentes</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#f5a623] transition hover:text-[#f9b448]"
          >
            Tout voir <ArrowRight size={12} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <ShoppingCart size={32} className="mx-auto text-slate-700 mb-3" />
            <p className="text-sm text-slate-500">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/40">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-800/20">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800/60 text-xs font-bold text-slate-300">
                    {order.items?.length || 0}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{order.orderNumber || order.id}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {order.customerName} — {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-bold text-[#f5a623]">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ================================================================
// ADMIN ORDERS
// ================================================================
function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [refreshing, setRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadOrders = useCallback(() => {
    setRefreshing(true)
    adminOrdersApi
      .getAll()
      .then((res) => setOrders(res.data || []))
      .catch((err) => {
        logError('Erreur chargement commandes admin :', err)
        setOrders([])
      })
      .finally(() => {
        setRefreshing(false)
        setLoadingOrders(false)
      })
  }, [])

  // Chargement initial
  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Re-fetch à chaque refreshKey (polling + visibility + manuel)
  useEffect(() => {
    if (refreshKey === 0) return // déjà chargé au mount
    loadOrders()
  }, [loadOrders, refreshKey])

  // Polling temps réel : re-fetch toutes les 30s (pause si onglet caché)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) setRefreshKey((k) => k + 1)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Re-fetch quand l'onglet redevient visible
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) setRefreshKey((k) => k + 1)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const updateOrderStatus = async (orderId, currentStatus, newStatus) => {
    try {
      const res = await adminOrdersApi.updateStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...res.data } : o)))
    } catch {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: currentStatus } : o)))
    }
  }

  const filteredOrders = filterStatus === 'ALL' ? orders : orders.filter((o) => o.status === filterStatus)

  const statusCounts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === 'PENDING').length,
    CONFIRMED: orders.filter((o) => o.status === 'CONFIRMED').length,
    SHIPPED: orders.filter((o) => o.status === 'SHIPPED').length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED').length,
    CANCELLED: orders.filter((o) => o.status === 'CANCELLED').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white">Gestion des commandes</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              En direct
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Suivez et mettez à jour les commandes de vos clients
            {refreshing && <span className="ml-2 text-[#f5a623]">Mise à jour...</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
          title="Rafraichir les commandes"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Filtres par statut */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([key, count]) => {
          const isActive = filterStatus === key
          const label = key === 'ALL' ? 'Toutes' : (STATUS_CONFIG[key]?.label || key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilterStatus(key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                isActive
                  ? 'bg-[#f5a623] text-[#0b1f3a] shadow-md shadow-[#f5a623]/20'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? 'bg-[#0b1f3a]/15 text-[#0b1f3a]' : 'bg-slate-800 text-slate-500'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Contenu */}
      {loadingOrders ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent mb-4" />
          <p className="text-sm text-slate-400">Chargement des commandes...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 py-16">
          <ShoppingCart size={40} className="text-slate-700 mb-3" />
          <p className="text-sm font-semibold text-slate-400">
            {filterStatus === 'ALL' ? 'Aucune commande enregistrée' : `Aucune commande "${STATUS_CONFIG[filterStatus]?.label || filterStatus}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/80 transition hover:border-slate-700/60"
            >
              {/* Ligne du haut : numéro + statut + actions */}
              <div className="flex flex-col gap-3 border-b border-slate-800/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-white">{order.orderNumber || order.id}</span>
                  <StatusBadge status={order.status} />
                  <span className="hidden text-[11px] text-slate-500 sm:inline">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, order.status, e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white outline-none transition focus:border-[#f5a623]"
                  >
                    {Object.entries(STATUS_CONFIG).map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase text-slate-500">Total</p>
                    <p className="text-lg font-black text-[#f5a623]">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>

              {/* Détails : client + articles */}
              <div className="grid gap-4 px-6 py-4 md:grid-cols-2">
                {/* Client */}
                <div className="space-y-2 rounded-xl bg-slate-950/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Coordonnées client</p>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-center gap-2">
                      <Users size={12} className="text-slate-500" />
                      <span className="font-semibold text-white">{order.customerName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-500" />
                      <a href={`tel:${order.customerPhone}`} className="transition hover:text-[#f5a623]">{order.customerPhone}</a>
                    </p>
                    {order.customerEmail && (
                      <p className="flex items-center gap-2">
                        <Mail size={12} className="text-slate-500" />
                        <span>{order.customerEmail}</span>
                      </p>
                    )}
                    <p className="flex items-start gap-2">
                      <MapPin size={12} className="mt-0.5 text-slate-500 flex-shrink-0" />
                      <span>{order.shippingAddress}, {order.shippingCity}</span>
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/\D/g, '').replace(/^(?!221)/, '221')}?text=${encodeURIComponent(
                      `Bonjour ${order.customerName}, concernant votre commande ${order.orderNumber || order.id}...`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    <ExternalLink size={11} />
                    Contacter sur WhatsApp
                  </a>
                </div>

                {/* Articles */}
                <div className="space-y-2 rounded-xl bg-slate-950/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Articles ({order.items?.length})
                  </p>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.productImage && (
                          <img
                            src={resolveImageUrl(item.productImage)}
                            alt={item.productName}
                            loading="lazy"
                            decoding="async"
                            className="h-9 w-9 flex-shrink-0 rounded-lg border border-slate-800 object-cover bg-slate-900"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-200">{item.productName}</p>
                          <p className="text-[10px] text-slate-500">
                            x{item.quantity} × {formatPrice(item.productPrice)}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-300">
                          {formatPrice(item.productPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ================================================================
// GESTION DES CLIENTS
// ================================================================
function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerDetails, setCustomerDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const loadCustomers = useCallback(() => {
    setLoading(true)
    const params = search ? { search } : {}
    adminCustomersApi
      .getAll(params)
      .then((res) => setCustomers(res.data || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { loadCustomers() }, [loadCustomers])

  const openDetails = (customer) => {
    setSelectedCustomer(customer)
    setLoadingDetails(true)
    adminCustomersApi
      .getDetails(customer.id)
      .then((res) => setCustomerDetails(res.data))
      .catch(() => setCustomerDetails(null))
      .finally(() => setLoadingDetails(false))
  }

  const closeDetails = () => {
    setSelectedCustomer(null)
    setCustomerDetails(null)
  }

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
  const totalOrders = customers.reduce((sum, c) => sum + (c.orderCount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Gestion des clients</h1>
          <p className="mt-1 text-sm text-slate-400">
            {totalCustomers} client{totalCustomers > 1 ? 's' : ''} inscrit{totalCustomers > 1 ? 's' : ''} — {totalOrders} commande{totalOrders > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total clients</p>
              <p className="text-2xl font-black text-white">{totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Chiffre d'affaires</p>
              <p className="text-2xl font-black text-[#f5a623]">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <ShoppingCart size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Commandes totales</p>
              <p className="text-2xl font-black text-white">{totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email, téléphone..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-500/20"
        />
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent mb-4" />
          <p className="text-sm text-slate-400">Chargement des clients...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 py-16">
          <Users size={40} className="text-slate-700 mb-3" />
          <p className="text-sm font-semibold text-slate-400">
            {search ? 'Aucun client trouvé' : 'Aucun client inscrit'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-left text-slate-400">
                <th className="px-5 py-3.5 font-medium">Client</th>
                <th className="px-5 py-3.5 font-medium hidden sm:table-cell">Téléphone</th>
                <th className="px-5 py-3.5 font-medium text-center">Commandes</th>
                <th className="px-5 py-3.5 font-medium text-right">Total dépensé</th>
                <th className="px-5 py-3.5 font-medium hidden md:table-cell">Inscrit le</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-slate-800/40 bg-slate-900/30 transition hover:bg-slate-800/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f5a623]/20 to-[#f5a623]/5 text-xs font-black text-[#f5a623] border border-[#f5a623]/20">
                        {(customer.firstName?.[0] || '?')}{(customer.lastName?.[0] || '')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-slate-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-400 hidden sm:table-cell">
                    <a href={`tel:${customer.phone}`} className="transition hover:text-[#f5a623]">
                      {customer.phone || '—'}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-300">
                      {customer.orderCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-[#f5a623]">
                    {formatPrice(customer.totalSpent)}
                  </td>
                  <td className="px-5 py-4 text-slate-500 hidden md:table-cell">
                    {new Date(customer.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {customer.phone && (
                        <a
                          href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-500/10 hover:text-emerald-400"
                          title="WhatsApp"
                        >
                          <Phone size={15} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => openDetails(customer)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                        title="Voir le profil"
                      >
                        <ExternalLink size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal détails client */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                Profil client — {selectedCustomer.firstName} {selectedCustomer.lastName}
              </h3>
              <button type="button" onClick={closeDetails} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent mb-4" />
                <p className="text-sm text-slate-400">Chargement...</p>
              </div>
            ) : customerDetails ? (
              <div className="space-y-5 p-6">
                {/* Infos client */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-950/60 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Informations</p>
                    <div className="space-y-2 text-xs text-slate-300">
                      <p><span className="text-slate-500">Email :</span> <span className="font-semibold text-white">{customerDetails.email}</span></p>
                      <p><span className="text-slate-500">Téléphone :</span> <span className="font-semibold text-white">{customerDetails.phone || 'Non renseigné'}</span></p>
                      <p><span className="text-slate-500">Inscrit le :</span> <span className="font-semibold text-white">{new Date(customerDetails.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-950/60 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Statistiques</p>
                    <div className="space-y-2 text-xs text-slate-300">
                      <p><span className="text-slate-500">Commandes :</span> <span className="font-bold text-[#f5a623]">{customerDetails.orderCount}</span></p>
                      <p><span className="text-slate-500">Total dépensé :</span> <span className="font-bold text-[#f5a623]">{formatPrice(customerDetails.totalSpent)}</span></p>
                    </div>
                  </div>
                </div>

                {/* Historique commandes */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    Historique des commandes ({customerDetails.orders?.length || 0})
                  </p>
                  {customerDetails.orders?.length > 0 ? (
                    <div className="space-y-3">
                      {customerDetails.orders.map((order) => (
                        <div key={order.id} className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{order.orderNumber}</span>
                              <StatusBadge status={order.status} />
                            </div>
                            <span className="text-sm font-black text-[#f5a623]">{formatPrice(order.total)}</span>
                          </div>
                          <div className="space-y-1.5">
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-xs text-slate-400">
                                <span className="truncate mr-2">{item.productName} × {item.quantity}</span>
                                <span className="text-slate-500 flex-shrink-0">{formatPrice(item.total)}</span>
                              </div>
                            ))}
                          </div>
                          <p className="mt-2 text-[10px] text-slate-600">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">Aucune commande pour ce client.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-sm text-slate-400">Impossible de charger les détails.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ================================================================
// PARAMÈTRES
// ================================================================
function AdminSettings() {
  const { adminUser, setAdminUser } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)

  // Profil
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  // Mot de passe
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [pwdSaving, setPwdSaving] = useState(false)
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    adminSettingsApi
      .get()
      .then((res) => {
        setSettings(res.data)
        setProfileName(res.data.admin.name)
        setProfileEmail(res.data.admin.email)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMsg({ type: '', text: '' })
    try {
      const res = await adminSettingsApi.updateProfile({ name: profileName, email: profileEmail })
      setProfileMsg({ type: 'success', text: res.message || 'Profil mis à jour.' })
      if (setAdminUser) {
        setAdminUser({ ...adminUser, name: profileName, email: profileEmail })
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Erreur lors de la mise à jour.' })
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPwdMsg({ type: '', text: '' })
    if (newPwd.length < 6) return setPwdMsg({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' })
    if (newPwd !== confirmPwd) return setPwdMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas.' })

    setPwdSaving(true)
    try {
      const res = await adminSettingsApi.changePassword({ currentPassword: currentPwd, newPassword: newPwd })
      setPwdMsg({ type: 'success', text: res.message || 'Mot de passe modifié.' })
      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message || 'Erreur lors du changement.' })
    } finally {
      setPwdSaving(false)
    }
  }

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const parts = []
    if (d > 0) parts.push(`${d}j`)
    if (h > 0) parts.push(`${h}h`)
    parts.push(`${m}min`)
    return parts.join(' ')
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: Users },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'system', label: 'Système', icon: Server },
  ]

  const inputClass =
    'w-full rounded-xl bg-slate-950/60 border border-slate-700 text-white placeholder-slate-500 px-4 py-2.5 text-sm outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20 transition'

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent mb-4" />
        <p className="text-sm text-slate-400">Chargement des paramètres...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-400">Gérez votre compte administrateur et les informations système</p>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                isActive
                  ? 'bg-[#f5a623] text-[#0b1f3a] shadow-md shadow-[#f5a623]/20'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ONGLET PROFIL */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f9b448] to-[#f5a623] text-xl font-black text-[#0b1f3a] shadow-lg shadow-[#f5a623]/20">
                {profileName ? profileName[0].toUpperCase() : 'A'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{profileName || 'Administrateur'}</h2>
                <p className="text-xs text-slate-500">{settings?.admin?.role === 'admin' ? 'Super Administrateur' : settings?.admin?.role}</p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Nom complet</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Nom d'affichage"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Adresse email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="admin@bnsservices.sn"
                  className={inputClass}
                />
              </div>

              {profileMsg.text && (
                <p className={`text-sm rounded-lg px-3 py-2 border ${
                  profileMsg.type === 'success'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-red-400 bg-red-500/10 border-red-500/20'
                }`}>
                  {profileMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={profileSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-6 py-2.5 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#f9b448] disabled:opacity-50"
              >
                <Save size={16} />
                {profileSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Informations du compte</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-950/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rôle</p>
                <p className="mt-1 text-sm font-semibold text-white capitalize">{settings?.admin?.role}</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Membre depuis</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {settings?.admin?.createdAt ? new Date(settings.admin.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dernière modification</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {settings?.admin?.updatedAt ? new Date(settings.admin.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">ID Compte</p>
                <p className="mt-1 text-xs font-mono text-slate-400 truncate">{settings?.admin?.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ONGLET SÉCURITÉ */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Changer le mot de passe</h2>
                <p className="text-xs text-slate-500">Modifiez votre mot de passe administrateur</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Mot de passe actuel</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="Entrez votre mot de passe actuel"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Nouveau mot de passe</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Confirmer le nouveau mot de passe</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Retapez le nouveau mot de passe"
                  className={inputClass}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPwd}
                  onChange={(e) => setShowPwd(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#f5a623]"
                />
                <span className="text-xs text-slate-400">Afficher les mots de passe</span>
              </label>

              {pwdMsg.text && (
                <p className={`text-sm rounded-lg px-3 py-2 border ${
                  pwdMsg.type === 'success'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-red-400 bg-red-500/10 border-red-500/20'
                }`}>
                  {pwdMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={pwdSaving || !currentPwd || !newPwd || !confirmPwd}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500/90 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                <Shield size={16} />
                {pwdSaving ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-300">Sécurité du compte</p>
                <ul className="mt-2 space-y-1 text-xs text-amber-200/70">
                  <li>• Choisissez un mot de passe unique et difficile à deviner</li>
                  <li>• Utilisez au moins 8 caractères avec majuscules, chiffres et symboles</li>
                  <li>• Ne partagez jamais vos identifiants</li>
                  <li>• La durée de validité du token JWT est de {settings?.system?.jwtExpiresIn || '7d'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ONGLET SYSTÈME */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Statistiques de la plateforme */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Statistiques de la plateforme</h3>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: 'Produits', value: settings?.stats?.totalProducts, icon: Package, color: 'text-blue-400' },
                { label: 'Clients', value: settings?.stats?.totalCustomers, icon: Users, color: 'text-indigo-400' },
                { label: 'Commandes', value: settings?.stats?.totalOrders, icon: ShoppingCart, color: 'text-emerald-400' },
                { label: 'Catégories', value: settings?.stats?.totalCategories, icon: LayoutDashboard, color: 'text-purple-400' },
                { label: 'En attente', value: settings?.stats?.pendingOrders, icon: Clock, color: 'text-amber-400' },
                { label: 'Revenus', value: formatPrice(settings?.stats?.totalRevenue || 0), icon: TrendingUp, color: 'text-[#f5a623]' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-xl bg-slate-950/60 p-4 text-center">
                    <Icon size={18} className={`mx-auto mb-2 ${stat.color}`} />
                    <p className="text-lg font-black text-white">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Infos serveur */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server size={18} className="text-slate-400" />
              <h3 className="text-sm font-bold text-white">Informations serveur</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4">
                <span className="text-xs text-slate-500">Port du serveur</span>
                <span className="text-sm font-bold text-white">{settings?.system?.port}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4">
                <span className="text-xs text-slate-500">Version Node.js</span>
                <span className="text-sm font-bold text-white">{settings?.system?.nodeVersion}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4">
                <span className="text-xs text-slate-500">Uptime</span>
                <span className="text-sm font-bold text-emerald-400">{settings?.system?.uptime ? formatUptime(settings.system.uptime) : '—'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4">
                <span className="text-xs text-slate-500">Expiration JWT</span>
                <span className="text-sm font-bold text-white">{settings?.system?.jwtExpiresIn}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4 sm:col-span-2">
                <span className="text-xs text-slate-500">Base de données</span>
                <span className="text-sm font-bold text-emerald-400">Connectée</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4 sm:col-span-2">
                <span className="text-xs text-slate-500">URL frontend autorisé</span>
                <span className="text-sm font-bold text-[#f5a623]">{settings?.system?.clientUrl}</span>
              </div>
            </div>
          </div>

          {/* État des services */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={18} className="text-emerald-400" />
              <h3 className="text-sm font-bold text-white">État des services</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: 'API Backend', status: 'Opérationnel', ok: true },
                { name: 'Base de données PostgreSQL', status: 'Connectée', ok: true },
                { name: 'Authentification JWT', status: 'Active', ok: true },
                { name: 'CORS', status: `Frontend ${settings?.system?.clientUrl || 'configuré'}`, ok: true },
                { name: 'Rate Limiting', status: 'Actif (300 req/min)', ok: true },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between rounded-xl bg-slate-950/60 px-4 py-3">
                  <span className="text-sm text-slate-300">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{service.status}</span>
                    <span className={`h-2 w-2 rounded-full ${service.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ================================================================
// PLACEHOLDER
// ================================================================
function PlaceholderSection({ title }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-900/40 py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60 mb-4">
        <Settings size={28} className="text-slate-600" />
      </div>
      <p className="text-sm font-semibold text-slate-400">{title}</p>
      <p className="mt-1 text-xs text-slate-600">Disponible prochainement</p>
    </div>
  )
}

// ================================================================
// MAIN DASHBOARD
// ================================================================
export default function AdminDashboard() {
  const { logoutAdmin, adminUser } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')

  const pageTitles = {
    dashboard: 'Tableau de bord',
    products: 'Produits',
    orders: 'Commandes',
    customers: 'Clients',
    settings: 'Paramètres',
  }

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-slate-950">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={logoutAdmin}
          activeItem={activeItem}
          onNavigate={setActiveItem}
          adminUser={adminUser}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          {/* Top bar mobile */}
          <header className="flex items-center justify-between border-b border-slate-800/60 bg-slate-950 px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#f9b448] to-[#f5a623] text-xs font-black text-[#0b1f3a]">
                B
              </div>
              <span className="text-sm font-bold text-white">{pageTitles[activeItem]}</span>
            </div>
            <div className="w-9" />
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {activeItem === 'dashboard' && <DashboardOverview onNavigate={setActiveItem} />}
              {activeItem === 'products' && <AdminProducts />}
              {activeItem === 'orders' && <AdminOrders />}
              {activeItem === 'customers' && <AdminCustomers />}
              {activeItem === 'settings' && <AdminSettings />}
            </div>
          </main>
        </div>
      </div>
    </AdminRoute>
  )
}
