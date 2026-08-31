import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Truck,
  Headphones,
  CreditCard,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Package,
  Heart,
  Target,
  Eye,
  Zap,
  CheckCircle2,
  Globe,
  MapPin,
  Mail,
  Phone
} from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Matériel authentique',
    description: 'Uniquement des produits neufs, sous garantie, provenant de distributeurs agréés.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Truck,
    title: 'Livraison rapide',
    description: 'Livraison 24h à 48h sur Dakar et les principales villes du Sénégal.',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    icon: CreditCard,
    title: 'Paiement à la livraison',
    description: 'Payez uniquement après avoir reçu et vérifié votre matériel. Aucun risque.',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Headphones,
    title: 'Support réactif',
    description: 'Notre équipe est joignable sur WhatsApp pour toute question avant ou après achat.',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
]

const stats = [
  { icon: Users, value: '500+', label: 'Clients satisfaits', color: 'text-[#0f2557]' },
  { icon: Package, value: '1000+', label: 'Produits livrés', color: 'text-[#e87722]' },
  { icon: Award, value: '100%', label: 'Produits garantis', color: 'text-emerald-600' },
  { icon: Globe, value: '14', label: 'Villes desservies', color: 'text-purple-600' },
]

const commitments = [
  'Produits 100% authentiques et garantis',
  'Livraison rapide partout au Sénégal',
  'Paiement sécurisé à la réception',
  'Service client réactif sur WhatsApp',
  'Retours et échanges facilités',
  'Conseils techniques personnalisés',
]

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-16 sm:space-y-16">

      {/* HERO avec gradient + stats */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2557] via-[#0f2557] to-[#1a3a8a] px-6 py-12 text-white sm:px-10 sm:py-16">
        {/* Decorations */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e87722]/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <Sparkles className="absolute right-8 top-8 h-8 w-8 text-[#e87722]/40" />
        <Sparkles className="absolute left-12 bottom-12 h-6 w-6 text-white/20" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white border border-white/20 backdrop-blur-sm">
            <Zap size={12} className="text-[#e87722]" /> À propos de nous
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            BNS <span className="text-[#e87722]">Services</span>
          </h1>
          <p className="mt-5 text-base text-white/80 leading-relaxed sm:text-lg">
            Votre partenaire de confiance pour le matériel informatique au Sénégal.
            Nous proposons une large gamme de produits technologiques, à des prix compétitifs,
            avec un service de livraison rapide et un paiement sécurisé à la réception.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/catalogue"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#e87722]/30 transition hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
            >
              Découvrir nos produits
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ icon: Icon, value, label, color }) => (
          <div
            key={label}
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6"
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition group-hover:scale-110 sm:h-12 sm:w-12">
              <Icon size={20} className={color} />
            </div>
            <p className="mt-3 text-2xl font-black text-[#0f2557] sm:text-3xl">{value}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">{label}</p>
          </div>
        ))}
      </section>

      {/* MISSION & VISION */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Mission */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-8">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#0f2557]/5 blur-2xl transition group-hover:bg-[#0f2557]/10" />
          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f2557] text-white">
              <Target size={22} />
            </div>
            <h2 className="mt-4 text-2xl font-black text-[#0f2557]">Notre mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Rendre la technologie accessible à tous les Sénégalais en proposant du matériel
              informatique de qualité, à des prix justes, avec un service client d'exception.
              Nous croyons que chaque entreprise et chaque foyer mérite d'être équipé
              convenablement pour réussir à l'ère numérique.
            </p>
          </div>
        </div>

        {/* Vision */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-8">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#e87722]/5 blur-2xl transition group-hover:bg-[#e87722]/10" />
          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e87722] to-[#f09050] text-white">
              <Eye size={22} />
            </div>
            <h2 className="mt-4 text-2xl font-black text-[#0f2557]">Notre vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Devenir la plateforme de référence pour l'achat de matériel informatique au Sénégal,
              en combinant catalogue varié, prix compétitifs, livraison rapide et service après-vente
              irréprochable. Nous aspirons à équiper les entreprises et particuliers de tout le pays.
            </p>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section>
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e87722]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e87722] border border-[#e87722]/20">
            <Heart size={11} /> Nos valeurs
          </span>
          <h2 className="mt-3 text-2xl font-black text-[#0f2557] sm:text-3xl">Pourquoi nous choisir ?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
            Des engagements concrets pour vous offrir la meilleure expérience d'achat.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {values.map(({ icon: Icon, title, description, bg, iconColor }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${bg} opacity-50 blur-2xl transition group-hover:opacity-100`} />
              <div className="relative">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${iconColor} transition group-hover:scale-110`}>
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-sm font-black text-[#0f2557] sm:text-base">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NOS ENGAGEMENTS */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-6 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              <CheckCircle2 size={11} /> Nos engagements
            </span>
            <h2 className="mt-3 text-2xl font-black text-[#0f2557] sm:text-3xl">
              Une qualité de service irréprochable
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Chez BNS Services, chaque client compte. Nous nous engageons à vous offrir
              une expérience d'achat simple, sûre et satisfaisante, de la commande à la livraison.
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            {commitments.map((commitment, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-emerald-300 hover:shadow-sm"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition group-hover:scale-110">
                  <CheckCircle2 size={14} />
                </div>
                <p className="text-xs font-semibold text-slate-700 sm:text-sm">{commitment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT RAPIDE */}
      <section className="grid gap-4 sm:grid-cols-3">
        <a
          href="https://wa.me/221784459510"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md sm:p-5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 transition group-hover:scale-110">
            <Phone size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">WhatsApp</p>
            <p className="truncate text-sm font-bold text-[#0f2557]">+221 78 445 95 10</p>
          </div>
        </a>

        <a
          href="mailto:contact@bayeniassservices.com"
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md sm:p-5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:scale-110">
            <Mail size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email</p>
            <p className="truncate text-sm font-bold text-[#0f2557]">contact@bayeniassservices.com</p>
          </div>
        </a>

        <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition group-hover:scale-110">
            <MapPin size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Adresse</p>
            <p className="truncate text-sm font-bold text-[#0f2557]">Dakar, Sénégal</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f2557] via-[#0f2557] to-[#1a3a8a] p-8 text-center text-white sm:p-12">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#e87722]/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative">
          <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl">
            Prêt à équiper votre bureau ?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/70 sm:text-base">
            Parcourez notre catalogue et commandez en quelques clics.
            Livraison rapide partout à Dakar et au Sénégal.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/catalogue"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#e87722]/30 transition hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
            >
              Voir le catalogue
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Une question ? Écrivez-nous
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
