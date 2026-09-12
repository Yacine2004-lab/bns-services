import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PaymentFailurePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-16 text-center">
      <section className="rounded-3xl border border-brand-200 bg-brand-50 px-6 py-12 sm:px-10">
        <AlertCircle size={62} className="mx-auto text-[#0f2557]" />
        <h1 className="mt-5 text-3xl font-black text-[#0f2557] sm:text-4xl">Paiement non finalisé</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">Le paiement a été refusé ou annulé. Votre commande reste conservée en attente et aucun stock supplémentaire n’a été retiré.</p>
      </section>
      <div className="flex flex-col justify-center gap-3 sm:flex-row"><Link to="/checkout" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e87722] px-5 py-3 text-sm font-black text-white"><RefreshCw size={17} /> Réessayer le paiement</Link><Link to="/catalogue" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#0f2557]"><ArrowLeft size={17} /> Choisir un autre mode</Link></div>
    </div>
  )
}
