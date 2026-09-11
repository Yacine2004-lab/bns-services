import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/useAuth'
import { ordersApi, paymentsApi, productsApi } from '../lib/api'
import { resolveImageUrl } from '../lib/resolveImageUrl'
import { logError } from '../lib/logger'
import { getDeliveryFee } from '../data/pricing'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

const CITIES = [
  'Dakar (Centre-ville, Plateau, Médina, Fann)',
  'Dakar (Almadies, Ngor, Ouakam, Yoff, Mermoz)',
  'Pikine / Guédiawaye',
  'Rufisque / Diamniadio',
  'Thiès / Mbour / Saly',
  'Saint-Louis',
  'Autre région du Sénégal',
]

const ONLINE_PAYMENT_OPTIONS = [
  {
    value: 'WAVE',
    label: 'Wave',
    description: 'Paiement sécurisé via Wave',
    logo: 'https://www.wave.com/img/nav-logo.png',
    logoFrame: 'bg-white',
  },
  {
    value: 'ORANGE_MONEY',
    label: 'Orange Money',
    description: 'Paiement sécurisé via Orange Money',
    logo: 'https://www.naboopay.com/orange_1%20(1).png',
    logoFrame: 'bg-white',
  },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, total, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: CITIES[0],
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stockWarnings, setStockWarnings] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY')
  const deliveryFee = getDeliveryFee(formData.city)
  const subtotal = total
  const grandTotal = subtotal + deliveryFee

  // Rafraichit le stock au chargement de la page
  useEffect(() => {
    let cancelled = false
    async function refreshStock() {
      try {
        const res = await productsApi.getAll()
        const products = res.data || res
        if (cancelled) return
        const productMap = new Map(products.map((p) => [p.id, p]))
        const warnings = []
        cart.forEach((item) => {
          const fresh = productMap.get(item.id)
          if (fresh && fresh.stock < item.quantity) {
            warnings.push({
              id: item.id,
              name: item.name,
              available: fresh.stock,
              requested: item.quantity,
            })
          }
        })
        setStockWarnings(warnings)
      } catch (err) {
        // Silencieux : le backend vérifiera le stock atomiquement à la commande
      }
    }
    if (cart.length > 0) refreshStock()
    return () => { cancelled = true }
  }, [])

  // Pré-remplissage si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
      }))
    }
  }, [user])

  // Redirige vers le catalogue si le panier est vide
  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      navigate('/catalogue')
    }
  }, [cart, navigate, isSubmitting])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const nextErrors = {}
    if (!formData.fullName.trim()) nextErrors.fullName = 'Veuillez saisir votre nom complet.'
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Le numéro de téléphone est requis pour la livraison.'
    } else {
      const digits = formData.phone.replace(/\D/g, '')
      if (digits.length < 7 || digits.length > 15) {
        nextErrors.phone = 'Format de téléphone invalide (ex: 77 123 45 67).'
      }
    }
    if (!formData.address.trim()) nextErrors.address = 'Veuillez préciser votre adresse ou repère de livraison.'
    if (!formData.city) nextErrors.city = 'Veuillez sélectionner une zone de livraison.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const generateWhatsAppMessage = (orderId) => {
    const itemsList = cart
      .map((item) => `• *${item.name}* (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}`)
      .join('\n')

    const message =
      `🛒 *NOUVELLE COMMANDE SUR BNS SERVICES*\n` +
      `-------------------------------------\n` +
      `📋 *Numéro de commande :* #${orderId}\n\n` +
      `📦 *Articles commandés :*\n${itemsList}\n\n` +
      `💰 *TOTAL :* ${formatPrice(grandTotal)}\n\n` +
      `👤 *Informations Client :*\n` +
      `• Nom : ${formData.fullName}\n` +
      `• Téléphone : ${formData.phone}\n` +
      (formData.email ? `• Email : ${formData.email}\n` : '') +
      `• Adresse : ${formData.address}\n` +
      `• Zone : ${formData.city}\n` +
      (formData.notes ? `• Remarques : ${formData.notes}\n` : '') +
      `\n💳 *Paiement :* À la livraison\n` +
      `-------------------------------------\n` +
      `Merci de me confirmer la prise en charge et le délai de livraison !`

    return encodeURIComponent(message)
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    try {
      // Vérifier la disponibilité du stock avant soumission
      const stockIssues = cart.filter((item) => {
        const stock = item.stock ?? Infinity
        return stock < item.quantity
      })
      if (stockIssues.length > 0) {
        const details = stockIssues
          .map((i) => `${i.name} (stock: ${i.stock}, demandé: ${i.quantity})`)
          .join(', ')
        setErrors({
          submit: `Certains articles ne sont plus disponibles en stock : ${details}. Veuillez ajuster votre panier.`,
        })
        window.scrollTo({ top: 100, behavior: 'smooth' })
        setIsSubmitting(false)
        return
      }

      // Construction du payload pour le backend
      const payload = {
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email || undefined,
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingNotes: formData.notes || undefined,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }

      // Appel API backend
      const res = await ordersApi.create(payload)
      const savedOrder = res.data

      if (paymentMethod !== 'CASH_ON_DELIVERY') {
        const payment = await paymentsApi.initiate({
          orderNumber: savedOrder.orderNumber,
          paymentMethod,
          phone: formData.phone,
        })
        sessionStorage.setItem('bns_last_order', JSON.stringify(savedOrder))
        sessionStorage.setItem('bns_current_order_id', savedOrder.orderNumber)
        window.location.assign(payment.data.checkoutUrl)
        return
      }

      // Prépare le lien WhatsApp avec le numéro de commande officiel
      const whatsappNumber = '221784459510'
      const waText = generateWhatsAppMessage(savedOrder.orderNumber || savedOrder.id)
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${waText}`

      clearCart()
      sessionStorage.setItem('bns_whatsapp_link', whatsappLink)
      sessionStorage.setItem('bns_current_order_id', savedOrder.orderNumber || savedOrder.id)
      sessionStorage.setItem('bns_last_order', JSON.stringify(savedOrder))
      navigate('/confirmation', { state: { order: savedOrder, whatsappLink } })
    } catch (err) {
      logError('Erreur lors de la soumission de la commande :', err)
      setErrors({ submit: err.message || 'Une erreur est survenue. Veuillez réessayer.' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) return null

  return (
    <div className="space-y-4 sm:space-y-8 pb-20 sm:pb-16">
      {/* 1. Header de navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-5">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0f2557] transition"
        >
          <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
          Continuer mes achats
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-emerald-200">
          <Lock size={11} className="sm:w-[13px] sm:h-[13px]" />
          Paiement 100% sécurisé à la livraison
        </div>
      </div>

      <div className="text-left">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0f2557]">
          Finaliser votre commande
        </h1>
        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">
          Complétez vos coordonnées pour recevoir votre matériel rapidement.
        </p>
      </div>

      {/* 2. Tunnel de commande en 2 Colonnes */}
      <div className="grid gap-4 sm:gap-8 lg:grid-cols-12">
        {/* Colonne Gauche : Formulaire (Sections A & C) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
        <form onSubmit={handlePlaceOrder} className="space-y-4 sm:space-y-6" noValidate>
            {/* Erreur API globale */}
            {errors.submit && (
              <div className="flex items-start gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-red-700">
                <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px] mt-0.5 shrink-0" />
                <p>{errors.submit}</p>
              </div>
            )}

            {/* Alerte stock insuffisant */}
            {stockWarnings.length > 0 && (
              <div className="flex items-start gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-amber-200 bg-amber-50 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-amber-800">
                <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Certains articles ont un stock limité :</p>
                  <ul className="mt-1 list-disc list-inside text-[11px] sm:text-xs">
                    {stockWarnings.map((w) => (
                      <li key={w.id}>
                        {w.name} — seulement {w.available} disponible(s) (vous avez demandé {w.requested})
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-[11px] sm:text-xs">Le stock sera vérifié définitivement à la validation de votre commande.</p>
                </div>
              </div>
            )}
            {/* Section A : Coordonnées & Livraison */}

            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 sm:py-8 shadow-[0_8px_25px_rgba(11,31,58,0.05)] sm:shadow-[0_12px_35px_rgba(11,31,58,0.06)] space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#0f2557] text-xs sm:text-sm font-bold text-white">
                    1
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-lg font-black text-[#0f2557]">
                      Informations de livraison
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-500">
                      Où devons-nous vous livrer ?
                    </p>
                  </div>
                </div>

                {!isAuthenticated() && (
                  <Link
                    to="/connexion"
                    className="text-[11px] sm:text-xs font-bold text-[#0f2557] hover:text-[#1a3a8a] hover:underline"
                  >
                    Déjà un compte ? Se connecter
                  </Link>
                )}
              </div>

              <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
                {/* Nom complet */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                  >
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Ex : Moussa Diop"
                      className={`w-full rounded-lg sm:rounded-xl border pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm text-[#0f2557] outline-none transition ${
                        errors.fullName
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                          : 'border-slate-200 bg-slate-50/50 focus:border-[#e87722] focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                  >
                    Téléphone (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ex : 77 123 45 67"
                      className={`w-full rounded-lg sm:rounded-xl border pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm text-[#0f2557] outline-none transition ${
                        errors.phone
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                          : 'border-slate-200 bg-slate-50/50 focus:border-[#e87722] focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email (optionnel) */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                  >
                    Email <span className="text-slate-400 font-normal">(Optionnel)</span>
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre-email@exemple.com"
                      className="w-full rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/50 pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm text-[#0f2557] outline-none transition focus:border-[#e87722] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Zone / Ville */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="city"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                  >
                    Zone de livraison <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#0f2557] outline-none transition focus:border-[#e87722] focus:bg-white"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Adresse exacte & Repères */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                  >
                    Adresse exacte & Repère <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-3.5 top-2.5 sm:top-3.5 text-slate-400"
                    />
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ex : Mermoz pyrotechnie, villa n°12, près de la pharmacie"
                      className={`w-full rounded-lg sm:rounded-xl border pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm text-[#0f2557] outline-none transition resize-none ${
                        errors.address
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                          : 'border-slate-200 bg-slate-50/50 focus:border-[#e87722] focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.address}
                    </p>
                  )}
                </div>

                {/* Remarques / Instructions livreur */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                  >
                    Instructions pour le livreur <span className="text-slate-400 font-normal">(Optionnel)</span>
                  </label>
                  <input
                    id="notes"
                    name="notes"
                    type="text"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ex : Appeler 15 min avant d'arriver"
                    className="w-full rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/50 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#0f2557] outline-none transition focus:border-[#e87722] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section C : Mode de paiement */}
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 sm:py-8 shadow-[0_8px_25px_rgba(11,31,58,0.05)] sm:shadow-[0_12px_35px_rgba(11,31,58,0.06)] space-y-3.5 sm:space-y-5">
              <div className="flex items-center gap-2.5 sm:gap-3 border-b border-slate-100 pb-3 sm:pb-4">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#0f2557] text-xs sm:text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <h2 className="text-sm sm:text-lg font-black text-[#0f2557]">
                    Mode de paiement
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Payez facilement à la réception
                  </p>
                </div>
              </div>

              <button type="button" onClick={() => setPaymentMethod('CASH_ON_DELIVERY')} className={`w-full rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4 flex items-start gap-3 sm:gap-4 text-left shadow-sm transition ${paymentMethod === 'CASH_ON_DELIVERY' ? 'border-[#e87722] bg-[#fffbf2]' : 'border-slate-200 bg-white hover:border-[#e87722]/40'}`}>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-[#e87722] text-[#0f2557] flex-shrink-0 mt-0.5 font-bold">
                  <Banknote size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-black text-[#0f2557]">
                      Paiement à la livraison (Espèces ou Mobile Money)
                    </h3>
                    {paymentMethod === 'CASH_ON_DELIVERY' && <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] sm:text-xs">✓</span>}
                  </div>
                  <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-600">
                    Vous inspectez votre colis et réglez en toute sérénité au moment de la remise en main propre.
                  </p>
                </div>
              </button>

              <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
                {ONLINE_PAYMENT_OPTIONS.map(({ value, label, description, logo, logoFrame }) => (
                  <button key={value} type="button" onClick={() => setPaymentMethod(value)} className={`min-h-[100px] sm:min-h-[132px] rounded-xl sm:rounded-2xl border-2 p-3 sm:p-5 text-left transition ${paymentMethod === value ? 'border-[#e87722] bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-[#e87722]/40'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-h-12 sm:min-h-16 items-center gap-2 sm:gap-3 text-sm sm:text-base font-black text-[#0f2557]">
                        <span className={`flex h-12 sm:h-16 ${value === 'WAVE' ? 'w-12 sm:w-16' : 'w-18 sm:w-24'} items-center justify-center overflow-hidden rounded-lg sm:rounded-xl border border-slate-200 p-1.5 sm:p-2 shadow-sm ${logoFrame}`}>
                          {value === 'WAVE' ? (
                            <span
                              role="img"
                              aria-label="Logo Wave"
                              className="h-full w-full bg-[length:auto_100%] bg-left bg-no-repeat"
                              style={{ backgroundImage: `url(${logo})` }}
                            />
                          ) : (
                            <img src={logo} alt={`${label} logo`} className="max-h-full max-w-full object-contain drop-shadow-sm" />
                          )}
                        </span>
                        <span className="leading-tight">{label}</span>
                      </span>
                      {paymentMethod === value && <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-500" />}
                    </div>
                    <span className="mt-0.5 sm:mt-1 block text-[11px] sm:text-xs text-slate-600">{description}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#e87722] py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold text-[#0f2557] shadow-lg sm:shadow-xl shadow-[#e87722]/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="sm:w-[22px] sm:h-[22px] animate-spin text-[#0f2557]" />
                  <span className="text-xs sm:inline">Traitement de votre commande en cours...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} className="sm:w-[22px] sm:h-[22px] text-[#0f2557]" />
                  <span>{paymentMethod === 'CASH_ON_DELIVERY' ? 'Confirmer la commande' : 'Payer maintenant'} ({formatPrice(grandTotal)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Colonne Droite : Récapitulatif (Section B) */}
        <div className="lg:col-span-5">
          <div className="space-y-4 sm:space-y-5 lg:sticky lg:top-24">
            <div className="rounded-xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-6 lg:p-7 shadow-[0_8px_25px_rgba(11,31,58,0.05)] sm:shadow-[0_12px_35px_rgba(11,31,58,0.06)] space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
                <h3 className="text-sm sm:text-lg font-black text-[#0f2557] flex items-center gap-1.5 sm:gap-2">
                  <ShoppingBag size={16} className="sm:w-5 sm:h-5 text-[#e87722]" />
                  Récapitulatif ({cart.reduce((s, i) => s + i.quantity, 0)} articles)
                </h3>
              </div>

              {/* Liste des articles */}
              <div className="max-h-60 sm:max-h-80 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 sm:gap-3.5 py-2.5 sm:py-3">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-slate-100 bg-[#f8fafc] p-1 sm:p-1.5 flex items-center justify-center">
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] sm:text-xs font-bold text-[#0f2557] truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                        Qté : <strong className="text-slate-800">{item.quantity}</strong> × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-[11px] sm:text-xs font-black text-[#0f2557] flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="border-t border-slate-100 pt-3 sm:pt-4 space-y-2 sm:space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                  <span>Sous-total</span>
                  <span className="font-semibold text-slate-800">{formatPrice(total)}</span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                  <span>Frais de livraison</span>
                  <span className="font-bold text-[#0f2557]">{formatPrice(deliveryFee)}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 sm:pt-3 text-[#0f2557]">
                  <span className="text-sm sm:text-base font-bold">Total à payer</span>
                  <span className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0f2557]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Encadré d'assurance et confiance */}
            <div className="rounded-2xl sm:rounded-3xl border border-emerald-200 bg-emerald-50/70 p-3.5 sm:p-5 text-emerald-900 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-2.5 font-bold text-xs sm:text-sm">
                <ShieldCheck size={16} className="sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                <span>Garantie BNS Services</span>
              </div>
              <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-emerald-800/90 pl-6 sm:pl-7 list-disc">
                <li>Matériel informatique authentique et vérifié</li>
                <li>Livraison rapide 24h/48h avec suivi WhatsApp</li>
                <li>Paiement uniquement à la livraison après vérification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
