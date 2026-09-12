import { useState } from 'react'
import {
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Headphones,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react'

const WHATSAPP_NUMBER = '221784459510'

const contactChannels = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+221 78 445 95 10',
    note: 'Réponse rapide, 8h - 20h',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
    hoverBorder: 'hover:border-green-300',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@bayeniassservices.com',
    note: 'Réponse sous 24h',
    href: 'mailto:contact@bayeniassservices.com',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-300',
  },
  {
    icon: MapPin,
    label: 'Adresse',
    value: 'Dakar, Sénégal',
    note: 'Sur rendez-vous uniquement',
    href: null,
    bg: 'bg-orange-50',
    iconColor: 'text-[#e87722]',
    hoverBorder: 'hover:border-orange-300',
  },
  {
    icon: Phone,
    label: 'Téléphone',
    value: '+221 78 445 95 10',
    note: 'Du lundi au samedi',
    href: 'tel:+221784459510',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-300',
  },
]

const reasons = [
  {
    icon: Clock,
    title: 'Réponse rapide',
    description: 'Notre équipe vous répond en moins d\'1h en journée sur WhatsApp.',
  },
  {
    icon: ShieldCheck,
    title: 'Conseils experts',
    description: 'Une équipe technique à votre écoute pour vous orienter.',
  },
  {
    icon: Headphones,
    title: 'SAV dédié',
    description: 'Un accompagnement avant, pendant et après votre achat.',
  },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = `Bonjour BNS Services,\n\nNom : ${form.name}\nEmail : ${form.email}\n\n${form.message}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
  }

  return (
    <div className="space-y-6 sm:space-y-10 pb-10 sm:pb-16">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0f2557] via-[#0f2557] to-[#1a3a8a] px-4 sm:px-6 py-8 sm:py-12 text-white">
        <div className="absolute -right-10 sm:-right-20 -top-10 sm:-top-20 h-48 sm:h-64 w-48 sm:w-64 rounded-full bg-[#0f2557]/20 blur-3xl" />
        <div className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 h-48 sm:h-64 w-48 sm:w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <Sparkles className="absolute right-4 sm:right-8 top-4 sm:top-8 h-6 w-6 sm:h-8 sm:w-8 text-[#0f2557]/40" />
        <Headphones className="absolute left-6 sm:left-10 bottom-6 sm:bottom-10 h-8 w-8 sm:h-10 sm:w-10 text-white/10" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white border border-white/20 backdrop-blur-sm">
            <Headphones size={10} className="sm:size-12 text-white" /> Service client
          </span>
          <h1 className="mt-3 sm:mt-5 text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight">
            Contactez-<span className="text-white/90">nous</span>
          </h1>
          <p className="mt-2 sm:mt-5 text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed">
            Une question, un besoin spécifique ou une commande en attente ?
            Notre équipe est disponible pour vous aider, par le canal de votre choix.
          </p>
        </div>
      </section>

      {/* 3 RAISONS DE NOUS CONTACTER */}
      <section className="grid gap-2 sm:gap-3 sm:grid-cols-3 sm:gap-4">
        {reasons.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:h-10 sm:w-9 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f2557] to-[#1a3a8a] text-white transition group-hover:scale-110">
              <Icon size={14} className="sm:size-18" />
            </div>
            <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm sm:text-base font-black text-[#0f2557]">{title}</h3>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs sm:text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        ))}
      </section>

      {/* COORDONNÉES + FORMULAIRE */}
      <section className="grid gap-4 sm:gap-6 lg:grid-cols-5">
        {/* Coordonnées */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <div>
            <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#0f2557]/10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#0f2557] border border-[#0f2557]/20">
              <Zap size={10} className="sm:size-11" /> Nos canaux
            </span>
            <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl sm:text-3xl font-black text-[#0f2557]">Restons en contact</h2>
            <p className="mt-1 text-xs sm:text-sm sm:text-base text-slate-600">
              Choisissez le canal qui vous convient le mieux, nous sommes réactifs sur tous.
            </p>
          </div>

          <div className="space-y-2 sm:space-y-2.5">
            {contactChannels.map(({ icon: Icon, label, value, note, href, bg, iconColor, hoverBorder }) => {
              const Wrapper = href ? 'a' : 'div'
              const wrapperProps = href
                ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noreferrer' }
                : {}
              return (
                <Wrapper
                  key={label}
                  {...wrapperProps}
                  className={`group flex items-start gap-2 sm:gap-3 rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 sm:p-3.5 transition-all duration-300 ${href ? `${hoverBorder} hover:-translate-y-0.5 hover:shadow-sm` : ''}`}
                >
                  <div className={`flex h-9 w-9 sm:h-10 sm:h-11 sm:w-10 sm:w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${iconColor} transition group-hover:scale-110`}>
                    <Icon size={14} className="sm:size-18" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                    <p className="truncate text-xs sm:text-sm font-bold text-[#0f2557]">{value}</p>
                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500">{note}</p>
                  </div>
                </Wrapper>
              )
            })}
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 sm:p-8 shadow-sm">
            <div className="absolute -right-10 sm:-right-16 -top-10 sm:-top-16 h-40 sm:h-48 w-40 sm:w-48 rounded-full bg-[#0f2557]/5 blur-3xl" />

            <div className="relative">
              {!sent ? (
                <>
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="flex h-8 w-8 sm:h-9 sm:h-10 sm:w-9 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f2557] to-[#1a3a8a] text-white">
                      <Send size={14} className="sm:size-16" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg sm:text-xl font-black text-[#0f2557]">Envoyez-nous un message</h2>
                      <p className="text-[10px] sm:text-[11px] sm:text-xs text-slate-500">Nous vous redirigeons vers WhatsApp pour une réponse rapide</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-3 sm:mt-5 space-y-2.5 sm:space-y-4">
                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 sm:mb-1.5 block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">
                          Votre nom
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Ex : Awa Diop"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 sm:px-4 py-1.5 sm:py-2 sm:py-2.5 text-xs sm:text-sm outline-none transition focus:border-[#0f2557] focus:bg-white focus:ring-4 focus:ring-[#0f2557]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-1 sm:mb-1.5 block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">
                          Votre email
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="toi@exemple.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 sm:px-4 py-1.5 sm:py-2 sm:py-2.5 text-xs sm:text-sm outline-none transition focus:border-[#0f2557] focus:bg-white focus:ring-4 focus:ring-[#0f2557]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 sm:mb-1.5 block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">
                        Votre message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="Décrivez votre besoin, votre question ou votre commande..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 sm:px-4 py-1.5 sm:py-2 sm:py-2.5 text-xs sm:text-sm outline-none transition focus:border-[#0f2557] focus:bg-white focus:ring-4 focus:ring-[#0f2557]/10 resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      className="group inline-flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#e87722]/25 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:shadow-[#e87722]/30 active:scale-[0.99]"
                    >
                      <MessageCircle size={14} className="sm:size-16" />
                      Envoyer via WhatsApp
                      <ArrowRight size={14} className="sm:size-16 transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="text-center text-[10px] sm:text-[11px] text-slate-500">
                      En envoyant ce formulaire, vous serez redirigé vers WhatsApp avec votre message pré-rempli.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-3 sm:space-y-4 py-4 sm:py-6 sm:py-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200" />
                      <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 size={28} className="sm:size-32" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl sm:text-2xl font-black text-[#0f2557]">Message envoyé !</h3>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm sm:text-base text-slate-600">
                      Votre message a été ouvert dans WhatsApp.<br />
                      Notre équipe vous répondra dans les plus brefs délais.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) })
                    className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition hover:border-[#0f2557] hover:text-[#0f2557]"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BANDEAU FOOTER */}
      <section className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-4 sm:p-6 sm:p-8">
        <div className="grid items-center gap-3 sm:gap-4 text-center sm:grid-cols-3 sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:gap-3 sm:justify-start">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <MessageCircle size={14} className="sm:size-18" />
            </div>
            <div className="text-left">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">Le plus rapide</p>
              <p className="text-xs sm:text-sm font-black text-[#0f2557]">WhatsApp</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-3 sm:justify-start">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Mail size={14} className="sm:size-18" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Le plus complet</p>
              <p className="text-sm font-black text-[#0f2557]">Email</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-3 sm:justify-start">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-brand-50 text-[#0f2557]">
              <Clock size={14} className="sm:size-18" />
            </div>
            <div className="text-left">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">Disponibilité</p>
              <p className="text-xs sm:text-sm font-black text-[#0f2557]">8h - 20h, 7j/7</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
