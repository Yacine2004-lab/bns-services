import { useEffect, useState } from 'react'
import { CheckCircle2, MessageCircle, Package, ArrowRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { ordersApi } from '../lib/api'
import { useCart } from '../context/CartContext'

const formatPrice = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value)

export default function PaymentSuccessPage() {
  const [params] = useSearchParams()
  const { clearCart } = useCart()
  const [order, setOrder] = useState(() => {
    try {
      const stored = sessionStorage.getItem('bns_last_order')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const orderNumber = params.get('order')

  useEffect(() => {
    if (orderNumber && !order) ordersApi.getByNumber(orderNumber).then((result) => setOrder(result.data)).catch(() => {})
    clearCart()
  }, [orderNumber, order, clearCart])

  const message = order ? encodeURIComponent(`Bonjour BNS Services, mon paiement a été effectué pour la commande ${order.orderNumber || order.id}. Total : ${formatPrice(order.total)}.`) : ''

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16 text-center">
      <section className="rounded-3xl bg-emerald-500 px-6 py-12 text-white shadow-xl sm:px-10">
        <CheckCircle2 size={64} className="mx-auto" />
        <h1 className="mt-5 text-3xl font-black sm:text-4xl">Paiement réussi</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/90 sm:text-base">Votre paiement a été confirmé. Votre commande est maintenant prise en charge par notre équipe.</p>
      </section>
      {order && <section className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm sm:p-8"><p className="text-xs font-black uppercase tracking-widest text-slate-400">Commande</p><p className="mt-1 text-2xl font-black text-[#0f2557]">{order.orderNumber || order.id}</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><p className="text-xs text-slate-400">Total payé</p><p className="mt-1 text-xl font-black text-[#e87722]">{formatPrice(order.total)}</p></div><div><p className="text-xs text-slate-400">Articles</p><p className="mt-1 text-sm font-bold text-[#0f2557]"><Package size={15} className="mr-1 inline" />{order.items?.length || 0} article(s)</p></div></div></section>}
      <div className="flex flex-col justify-center gap-3 sm:flex-row"><a href={`https://wa.me/221784459510?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-black text-white"><MessageCircle size={17} /> Envoyer le récapitulatif</a><Link to="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f2557] px-5 py-3 text-sm font-black text-white">Retour à l’accueil <ArrowRight size={17} /></Link></div>
    </div>
  )
}
