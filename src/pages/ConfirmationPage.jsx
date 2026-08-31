import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  CheckCircle2,
  MessageCircle,
  Package,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  Truck,
  Wallet,
  MapPin,
  Phone,
  User,
  ExternalLink
} from 'lucide-react'
import { ordersApi } from '../lib/api'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Prise en charge',
    description: 'Notre équipe valide vos articles et prépare le colis en stock.',
    bg: 'bg-amber-50',
    color: 'text-[#e87722]',
    border: 'border-amber-200',
  },
  {
    icon: Truck,
    title: 'Livraison Express',
    description: 'Le coursier vous contacte pour vous livrer à l\'adresse indiquée.',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    border: 'border-blue-200',
  },
  {
    icon: Wallet,
    title: 'Paiement à la réception',
    description: 'Vérifiez vos produits et réglez en espèces ou Mobile Money.',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    border: 'border-emerald-200',
  },
]

export default function ConfirmationPage() {
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [whatsappLink, setWhatsappLink] = useState('')

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order)
      const waLink =
        location.state?.whatsappLink ||
        sessionStorage.getItem('bns_whatsapp_link') ||
        'https://wa.me/221784459510'
      setWhatsappLink(waLink)
      return
    }

    const storedOrderId = sessionStorage.getItem('bns_current_order_id')
    if (storedOrderId) {
      ordersApi
        .getByNumber(storedOrderId)
        .then((res) => setOrder(res.data))
        .catch(() => {})
    }

    const waLink = sessionStorage.getItem('bns_whatsapp_link') || 'https://wa.me/221784459510'
    setWhatsappLink(waLink)
  }, [location.state])

  return (
    <div className="space-y-8 pb-16 sm:space-y-10">

      {/* HERO SUCCESS */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-600 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <Sparkles className="absolute right-8 top-8 h-6 w-6 text-white/30" />
        <Sparkles className="absolute left-12 bottom-12 h-8 w-8 text-white/20" />

        <div className="relative">
          <div className="relative mx-auto inline-flex">
            <div className="absolute inset-0 animate-ping rounded-full bg-white/30" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-emerald-500 shadow-2xl sm:h-24 sm:w-24">
              <CheckCircle2 size={48} strokeWidth={2.2} className="sm:hidden" />
              <CheckCircle2 size={56} strokeWidth={2.2} className="hidden sm:block" />
            </div>
          </div>

          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white border border-white/30 backdrop-blur-sm">
            Commande enregistrée
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Merci pour votre commande !
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/90 sm:text-base">
            Votre commande a bien été prise en compte. Notre équipe prépare votre matériel informatique avec le plus grand soin.
          </p>
        </div>
      </section>

      {/* CARTE DE DETAILS */}
      {order && (
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.06)] sm:p-8">
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[#e87722]/5 blur-3xl" />

          <div className="relative space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Numéro de commande
                </p>
                <p className="mt-1 text-2xl font-black text-[#0f2557]">
                  {order.orderNumber || order.id}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Total à la livraison
                </p>
                <p className="mt-1 text-3xl font-black text-[#e87722]">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>

            {/* Destinataire & Articles */}
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0f2557]/10 text-[#0f2557]">
                    <User size={14} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#0f2557]">
                    Destinataire
                  </p>
                </div>
                <div className="mt-2.5 space-y-1">
                  <p className="text-sm font-bold text-[#0f2557]">{order.customerName}</p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Phone size={11} /> {order.customerPhone}
                  </p>
                  <p className="flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin size={11} className="mt-0.5 shrink-0" />
                    <span>{order.shippingAddress}, {order.shippingCity}</span>
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e87722]/10 text-[#e87722]">
                    <Package size={14} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#0f2557]">
                    Contenu ({order.items?.length} article{order.items?.length > 1 ? 's' : ''})
                  </p>
                </div>
                <div className="mt-2.5 max-h-24 space-y-1 overflow-y-auto pr-1">
                  {order.items?.map((item) => (
                    <p key={item.id} className="text-xs text-slate-700 truncate">
                      · <strong>{item.productName}</strong> × {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Bouton WhatsApp */}
            {whatsappLink && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-50/80 to-emerald-50 p-5 border border-emerald-200 text-center">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl" />
                <div className="relative">
                  <p className="text-xs font-bold text-emerald-900 sm:text-sm">
                    💬 Envoyez le récapitulatif à notre équipe sur WhatsApp pour confirmation immédiate :
                  </p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-4 inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1EBE5D] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  >
                    <MessageCircle size={18} className="transition-transform group-hover:scale-110" />
                    <span>Ouvrir sur WhatsApp</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ETAPES DE LIVRAISON */}
      <section>
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e87722]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e87722] border border-[#e87722]/20">
            <Truck size={11} /> Suivi de commande
          </span>
          <h2 className="mt-2 text-2xl font-black text-[#0f2557] sm:text-3xl">Les étapes suivantes</h2>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {steps.map(({ icon: Icon, title, description, bg, color, border }, idx) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl border ${border} bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
            >
              <div className={`absolute -right-10 -top-10 h-24 w-24 rounded-full ${bg} opacity-50 blur-2xl transition group-hover:opacity-100`} />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color} transition group-hover:scale-110`}>
                    <Icon size={18} />
                  </div>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${bg} text-[10px] font-black ${color}`}>
                    {idx + 1}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-black text-[#0f2557] sm:text-base">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACTIONS */}
      <section className="flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center">
        <Link
          to="/catalogue"
          className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#0f2557] transition-all duration-200 hover:scale-[1.02] hover:border-[#e87722] hover:text-[#e87722] active:scale-[0.98]"
        >
          <ShoppingBag size={16} />
          Continuer mes achats
        </Link>

        <Link
          to="/"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0f2557] to-[#1a3a8a] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#0f2557]/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          Retour à l'accueil
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

    </div>
  )
}
