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
    value: 'contact@bnsservices.sn',
    note: 'Réponse sous 24h',
    href: 'mailto:contact@bnsservices.sn',
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
    <div className="space-y-10 pb-16 sm:space-y-14">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2557] via-[#0f2557] to-[#1a3a8a] px-6 py-12 text-white sm:px-10 sm:py-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e87722]/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <Sparkles className="absolute right-8 top-8 h-8 w-8 text-[#e87722]/40" />
        <Headphones className="absolute left-10 bottom-10 h-10 w-10 text-white/10" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white border border-white/20 backdrop-blur-sm">
            <Headphones size={12} className="text-[#e87722]" /> Service client
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Contactez-<span className="text-[#e87722]">nous</span>
          </h1>
          <p className="mt-5 text-base text-white/80 leading-relaxed sm:text-lg">
            Une question, un besoin spécifique ou une commande en attente ?
            Notre équipe est disponible pour vous aider, par le canal de votre choix.
          </p>
        </div>
      </section>

      {/* 3 RAISONS DE NOUS CONTACTER */}
      <section className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {reasons.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e87722] to-[#f09050] text-white transition group-hover:scale-110 sm:h-10 sm:w-10">
              <Icon size={18} />
            </div>
            <h3 className="mt-3 text-sm font-black text-[#0f2557] sm:text-base">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{description}</p>
          </div>
        ))}
      </section>

      {/* COORDONNÉES + FORMULAIRE */}
      <section className="grid gap-6 lg:grid-cols-5">
        {/* Coordonnées */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e87722]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e87722] border border-[#e87722]/20">
              <Zap size={11} /> Nos canaux
            </span>
            <h2 className="mt-2 text-2xl font-black text-[#0f2557] sm:text-3xl">Restons en contact</h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Choisissez le canal qui vous convient le mieux, nous sommes réactifs sur tous.
            </p>
          </div>

          <div className="space-y-2.5">
            {contactChannels.map(({ icon: Icon, label, value, note, href, bg, iconColor, hoverBorder }) => {
              const Wrapper = href ? 'a' : 'div'
              const wrapperProps = href
                ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noreferrer' }
                : {}
              return (
                <Wrapper
                  key={label}
                  {...wrapperProps}
                  className={`group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all duration-300 ${href ? `${hoverBorder} hover:-translate-y-0.5 hover:shadow-sm` : ''} sm:p-3.5`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg} ${iconColor} transition group-hover:scale-110 sm:h-11 sm:w-11`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                    <p className="truncate text-sm font-bold text-[#0f2557]">{value}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{note}</p>
                  </div>
                </Wrapper>
              )
            })}
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#e87722]/5 blur-3xl" />

            <div className="relative">
              {!sent ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e87722] to-[#f09050] text-white sm:h-10 sm:w-10">
                      <Send size={16} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#0f2557] sm:text-xl">Envoyez-nous un message</h2>
                      <p className="text-[11px] text-slate-500 sm:text-xs">Nous vous redirigeons vers WhatsApp pour une réponse rapide</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">
                          Votre nom
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Ex : Awa Diop"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-sm outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">
                          Votre email
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="toi@exemple.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-sm outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">
                        Votre message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="Décrivez votre besoin, votre question ou votre commande..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-sm outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10 resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#e87722]/25 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:shadow-[#e87722]/30 active:scale-[0.99]"
                    >
                      <MessageCircle size={16} />
                      Envoyer via WhatsApp
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="text-center text-[11px] text-slate-500">
                      En envoyant ce formulaire, vous serez redirigé vers WhatsApp avec votre message pré-rempli.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-4 py-6 sm:py-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 size={32} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f2557] sm:text-2xl">Message envoyé !</h3>
                    <p className="mt-2 text-sm text-slate-600 sm:text-base">
                      Votre message a été ouvert dans WhatsApp.<br />
                      Notre équipe vous répondra dans les plus brefs délais.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#e87722] hover:text-[#e87722]"
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
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-6 sm:p-8">
        <div className="grid items-center gap-4 text-center sm:grid-cols-3 sm:text-left">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <MessageCircle size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Le plus rapide</p>
              <p className="text-sm font-black text-[#0f2557]">WhatsApp</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Mail size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Le plus complet</p>
              <p className="text-sm font-black text-[#0f2557]">Email</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Clock size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Disponibilité</p>
              <p className="text-sm font-black text-[#0f2557]">8h - 20h, 7j/7</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
