import { useState } from 'react'
import { MessageCircle, Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react'

const WHATSAPP_NUMBER = '221784459510'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Pour l'instant, on redirige vers WhatsApp avec le message pré-rempli
    const text = `Bonjour BNS Services,\n\nNom : ${form.name}\nEmail : ${form.email}\n\n${form.message}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Titre */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight text-[#0B1F3A] sm:text-5xl">
          Contactez-nous
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Une question, un besoin spécifique ou une commande en attente ?
          Notre équipe est disponible pour vous aider.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Coordonnées */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#0B1F3A]">Nos coordonnées</h2>

            <div className="space-y-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] flex-shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1F3A]">WhatsApp</p>
                  <p className="text-xs text-slate-500">+221 78 445 95 10</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Réponse rapide, 8h-20h</p>
                </div>
              </a>

              <div className="flex items-start gap-3 rounded-xl p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1F3A]">Email</p>
                  <p className="text-xs text-slate-500">contact@bnsservices.sn</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#f5a623] flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1F3A]">Adresse</p>
                  <p className="text-xs text-slate-500">Dakar, Sénégal</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1F3A]">Téléphone</p>
                  <p className="text-xs text-slate-500">+221 78 445 95 10</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            {!sent ? (
              <>
                <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">
                  Envoyez-nous un message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
                      Votre nom
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Ex : Awa Diop"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
                      Votre email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="toi@exemple.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
                      Votre message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Décrivez votre besoin ou votre question..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20 resize-y"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5a623] py-3 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#f9b448]"
                  >
                    <Send size={16} />
                    Envoyer via WhatsApp
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4 py-8">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A]">Message envoyé !</h3>
                <p className="text-sm text-slate-500">
                  Votre message a été ouvert dans WhatsApp. Notre équipe vous répondra rapidement.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                  className="text-sm font-semibold text-[#f5a623] hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
