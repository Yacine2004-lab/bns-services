import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2, Loader2, Shield } from 'lucide-react'
import { adminAuthApi } from '../lib/api'

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez saisir un email valide.')
      return
    }

    try {
      setIsSubmitting(true)
      await adminAuthApi.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Réessaie plus tard.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo admin */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 mb-4">
            <Shield size={32} className="text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Mot de passe oublié</h1>
          <p className="text-slate-400 text-sm">Espace Administrateur — BNS Services</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
          {!sent ? (
            <>
              <p className="text-slate-300 text-sm text-center mb-6">
                Entrez l'adresse email associée à votre compte administrateur. Un lien de réinitialisation vous sera envoyé.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email administrateur
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@bnsservices.sn"
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#f9b448] text-[#0b1f3a] font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le lien'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">
                Email envoyé !
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Si un compte administrateur existe avec l'adresse <strong className="text-slate-300">{email}</strong>, vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          <Link
            to="/admin/connexion"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-300 hover:text-[#f5a623] transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Retour à la connexion admin
          </Link>
        </p>
      </div>
    </div>
  )
}
