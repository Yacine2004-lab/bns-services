import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  ArrowRight,
  Package,
  ShieldCheck,
  ExternalLink,
  ShoppingBag
} from 'lucide-react'
import { ordersApi } from '../lib/api'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

export default function ConfirmationPage() {
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [whatsappLink, setWhatsappLink] = useState('')

  useEffect(() => {
    // Récupérer la commande depuis l'état de navigation
    if (location.state?.order) {
      setOrder(location.state.order)
      const waLink =
        location.state?.whatsappLink ||
        sessionStorage.getItem('bns_whatsapp_link') ||
        'https://wa.me/221784459510'
      setWhatsappLink(waLink)
      return
    }

    // Fallback : si la page est rafraîchie, récupérer via l'ID stocké
    const storedOrderId = sessionStorage.getItem('bns_current_order_id')
    if (storedOrderId) {
      ordersApi
        .getByNumber(storedOrderId)
        .then((res) => {
          setOrder(res.data)
        })
        .catch(() => {
          // Commande introuvable, on laisse l'état null
        })
    }

    const waLink =
      sessionStorage.getItem('bns_whatsapp_link') || 'https://wa.me/221784459510'
    setWhatsappLink(waLink)
  }, [location.state])

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* 1. Badge de Succès avec Animation */}
      <div className="text-center space-y-4 pt-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full bg-emerald-100 animate-ping opacity-30" />
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl shadow-emerald-500/25">
            <CheckCircle2 size={54} strokeWidth={2.2} />
          </div>
        </div>

        <div>
          <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            Commande enregistrée avec succès
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#0B1F3A]">
            Merci pour votre commande !
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Votre commande a bien été prise en compte. Notre équipe prépare votre matériel informatique avec le plus grand soin.
          </p>
        </div>
      </div>

      {/* 2. Carte de détails de la commande */}
      {order && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_16px_40px_rgba(11,31,58,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Numéro de commande
              </p>
              <p className="text-xl font-black text-[#0B1F3A]">
                {order.orderNumber || order.id}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total à la livraison
              </p>
              <p className="text-2xl font-black text-[#f5a623]">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>

          {/* Destinataire & Articles */}
          <div className="grid gap-6 sm:grid-cols-2 text-sm">
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                👤 Destinataire
              </p>
              <p className="font-bold text-[#0B1F3A]">{order.customerName}</p>
              <p className="text-xs text-slate-600">📱 {order.customerPhone}</p>
              <p className="text-xs text-slate-600">📍 {order.shippingAddress}, {order.shippingCity}</p>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                📦 Contenu du colis ({order.items?.length} article{order.items?.length > 1 ? 's' : ''})
              </p>
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                {order.items?.map((item) => (
                  <p key={item.id} className="text-xs text-slate-700 truncate">
                    • <strong>{item.productName}</strong> (x{item.quantity})
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton WhatsApp direct */}
          {whatsappLink && (
            <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-emerald-50 p-5 border border-emerald-200 text-center space-y-3">
              <p className="text-xs font-bold text-emerald-900">
                💬 Envoyez instantanément le récapitulatif à notre équipe sur WhatsApp pour confirmation :
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all"
              >
                <MessageCircle size={20} className="fill-white" />
                <span>Ouvrir ma commande sur WhatsApp</span>
                <ExternalLink size={15} />
              </a>
            </div>
          )}
        </div>
      )}

      {/* 3. Les 3 étapes de livraison */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#f5a623] mx-auto font-black text-sm">
            1
          </div>
          <h4 className="font-bold text-xs text-[#0B1F3A]">Prise en charge</h4>
          <p className="text-[11px] text-slate-500">
            Notre équipe valide vos articles et prépare le colis en stock.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mx-auto font-black text-sm">
            2
          </div>
          <h4 className="font-bold text-xs text-[#0B1F3A]">Livraison Express</h4>
          <p className="text-[11px] text-slate-500">
            Le coursier vous contacte pour vous livrer à l'adresse indiquée.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto font-black text-sm">
            3
          </div>
          <h4 className="font-bold text-xs text-[#0B1F3A]">Paiement à la réception</h4>
          <p className="text-[11px] text-slate-500">
            Vérifiez vos produits et réglez en espèces ou Mobile Money.
          </p>
        </div>
      </div>

      {/* 4. Boutons d'actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/catalogue"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-[#0B1F3A] hover:bg-slate-50 transition shadow-xs"
        >
          <ShoppingBag size={16} />
          <span>Continuer mes achats</span>
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0B1F3A] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#143765] transition shadow-md"
        >
          <span>Retour à l'accueil</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
