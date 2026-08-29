import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { authApi } from '../lib/api'

export default function ForgotPassword() {
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
      await authApi.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Réessaie plus tard.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fafbfd] via-white to-[#f5f8fc] px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#F5A623] flex items-center justify-center font-black text-[#0B1F3A]">
            B
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-[#0B1F3A]">BNS</div>
            <div className="text-[10px] font-semibold tracking-widest text-[#F5A623]">
              SERVICES
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
          {!sent ? (
            <>
              <h1 className="text-2xl font-black text-[#0B1F3A] mb-1 text-center">
                Mot de passe oublié
              </h1>
              <p className="text-gray-500 text-sm text-center mb-6">
                Entre ton adresse email et nous t'enverrons un lien de réinitialisation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="toi@exemple.com"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#0B1F3A] text-[#0B1F3A] hover:text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-60"
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={32} />
                </div>
              </div>
              <h2 className="text-xl font-black text-[#0B1F3A]">
                Email envoyé !
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Si un compte existe avec l'adresse <strong>{email}</strong>, tu recevras un lien de réinitialisation dans quelques minutes.
                Vérifie aussi tes spams.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link
            to="/connexion"
            className="inline-flex items-center gap-1.5 font-semibold text-[#0B1F3A] hover:text-[#F5A623] transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}
