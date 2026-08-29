import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, Headphones, CreditCard, ArrowRight, Zap } from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Matériel authentique',
    description: 'Uniquement des produits neufs, sous garantie, provenant de distributeurs agréés.',
  },
  {
    icon: Truck,
    title: 'Livraison rapide',
    description: 'Livraison 24h à 48h sur Dakar et les principales villes du Sénégal.',
  },
  {
    icon: CreditCard,
    title: 'Paiement à la livraison',
    description: 'Payez uniquement après avoir reçu et vérifié votre matériel. Aucun risque.',
  },
  {
    icon: Headphones,
    title: 'Support réactif',
    description: 'Notre équipe est joignable sur WhatsApp pour toute question avant ou après achat.',
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#f5a623]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#f5a623] border border-[#f5a623]/20">
          <Zap size={12} /> À propos de nous
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F3A] sm:text-5xl">
          BNS Services
        </h1>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
          Votre partenaire de confiance pour le matériel informatique au Sénégal.
          Nous proposons une large gamme de produits technologiques — ordinateurs, téléphones,
          accessoires, audio et équipements réseau — à des prix compétitifs, avec un service
          de livraison rapide et un paiement sécurisé à la réception.
        </p>
      </div>

      {/* Valeurs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5a623]/10 text-[#f5a623]">
              <Icon size={24} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#0B1F3A]">{title}</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B1F3A] to-[#143765] p-10 text-center text-white">
        <h2 className="text-2xl font-black sm:text-3xl">
          Prêt à équiper votre bureau ?
        </h2>
        <p className="mt-3 text-sm text-white/70 max-w-lg mx-auto">
          Parcourez notre catalogue et commandez en quelques clics.
          Livraison rapide partout à Dakar.
        </p>
        <Link
          to="/catalogue"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-8 py-3 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#f9b448]"
        >
          Voir le catalogue
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
