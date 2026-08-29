import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { adminAuthApi } from '../lib/api'

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Indicateur de force du mot de passe
  const passwordStrength = (() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })()

  const strengthLabel = ['Trop faible', 'Faible', 'Correct', 'Bon', 'Excellent'][passwordStrength]
  const strengthColor = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-lime-500', 'bg-emerald-500'][passwordStrength]

  // Si pas de token dans l'URL
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Lien invalide</h2>
          <p className="text-sm text-slate-400">
            Ce lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.
          </p>
          <Link
            to="/admin/mot-de-passe-oublie"
            className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 font-bold text-[#0b1f3a] transition hover:bg-[#f9b448]"
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password || password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    try {
      setIsSubmitting(true)
      await adminAuthApi.resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Réessaie plus tard.')
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
            <ShieldCheck size={32} className="text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Nouveau mot de passe</h1>
          <p className="text-slate-400 text-sm">Espace Administrateur — BNS Services</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
          {!success ? (
            <>
              <p className="text-slate-300 text-sm text-center mb-6">
                Choisissez un nouveau mot de passe sécurisé pour votre compte administrateur.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="88888888"
                      autoComplete="new-password"
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 outline-none transition-all duration-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              i < passwordStrength ? strengthColor : 'bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{strengthLabel}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="88888888"
                      autoComplete="new-password"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">Les mots de passe ne correspondent pas.</p>
                  )}
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
                      Modification en cours...
                    </>
                  ) : (
                    'Modifier le mot de passe'
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
                Mot de passe modifié !
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Le mot de passe administrateur a été réinitialisé avec succès.
              </p>
              <button
                onClick={() => navigate('/admin/connexion')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 font-bold text-[#0b1f3a] transition hover:bg-[#f9b448]"
              >
                Se connecter
              </button>
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
