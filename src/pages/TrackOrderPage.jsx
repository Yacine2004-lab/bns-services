import { useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, MessageCircle, PackageSearch, Phone, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ordersApi } from '../lib/api'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

const statusLabels = {
  PENDING: 'En attente de confirmation',
  CONFIRMED: 'Commande confirmée',
  SHIPPED: 'En livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
}

const statusStyles = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
}

const WHATSAPP_NUMBER = '221784459510'

export default function TrackOrderPage() {
  const [formData, setFormData] = useState({ orderNumber: '', phone: '' })
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setOrder(null)
    setIsLoading(true)

    try {
      const result = await ordersApi.getByNumber(formData.orderNumber.trim(), formData.phone.trim())
      setOrder(result.data)
    } catch (requestError) {
      setError(requestError.message || 'Commande introuvable. Vérifiez vos informations.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 sm:space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-[#0f2557] px-6 py-10 text-white shadow-[0_20px_50px_rgba(15,37,87,0.2)] sm:px-10 sm:py-14">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#e87722]/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#f6a56b]">
            <PackageSearch size={15} /> Suivi invité
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Où en est votre commande ?</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
            Retrouvez l’état de votre commande sans créer de compte avec votre référence et votre numéro de téléphone.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.06)] sm:p-8">
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2 sm:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-[#0f2557]">Référence de commande</span>
            <input
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              placeholder="Ex : CMD-123456"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-[#0f2557] outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10"
            />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0f2557]"><Phone size={13} /> Téléphone utilisé</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex : 77 123 45 67"
              inputMode="tel"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-[#0f2557] outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10"
            />
          </label>
          <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e87722] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#e87722]/20 transition hover:bg-[#f09050] disabled:cursor-wait disabled:opacity-70 sm:col-span-2">
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {isLoading ? 'Recherche...' : 'Rechercher ma commande'}
          </button>
        </form>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-emerald-900">Vous avez oublié votre référence ?</p>
            <p className="mt-1 text-xs leading-5 text-emerald-800/80">Notre équipe peut retrouver votre commande avec votre numéro de téléphone.</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour BNS Services, j'ai oublié ma référence de commande. Mon téléphone est : ${formData.phone || 'à préciser'}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-black text-white shadow-sm transition hover:bg-[#1ebe5d]"
          >
            <MessageCircle size={16} /> Contacter BNS
          </a>
        </div>
      </section>

      {order && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Commande retrouvée</p>
              <h2 className="mt-1 text-2xl font-black text-[#0f2557]">{order.orderNumber || order.id}</h2>
            </div>
            <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${statusStyles[order.status] || statusStyles.PENDING}`}>
              <CheckCircle2 size={15} /> {statusLabels[order.status] || order.status}
            </div>
          </div>
          <div className="grid gap-4 py-5 sm:grid-cols-3">
            <div><p className="text-xs text-slate-400">Total</p><p className="mt-1 text-lg font-black text-[#e87722]">{formatPrice(order.total)}</p></div>
            <div><p className="text-xs text-slate-400">Destinataire</p><p className="mt-1 text-sm font-bold text-[#0f2557]">{order.customerName}</p></div>
            <div><p className="text-xs text-slate-400">Livraison</p><p className="mt-1 text-sm font-bold text-[#0f2557]">{order.shippingCity}</p></div>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">{order.items?.length || 0} article(s) dans cette commande</p>
            <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-black text-[#0f2557] hover:text-[#e87722]">Besoin d’aide ? <ArrowRight size={15} /></Link>
          </div>
        </section>
      )}
    </div>
  )
}
