import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { authApi } from '../lib/api'

export default function ResetPassword() {
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

  // Si pas de token dans l'URL, redirection
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fafbfd] via-white to-[#f5f8fc] px-6 py-12">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-xl font-black text-[#0f2557]">Lien invalide</h2>
          <p className="text-sm text-gray-500">
            Ce lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.
          </p>
          <Link
            to="/mot-de-passe-oublie"
            className="inline-flex items-center gap-2 rounded-xl bg-[#e87722] px-6 py-3 font-bold text-[#0f2557] transition hover:bg-[#e87722]"
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
      await authApi.resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Réessaie plus tard.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fafbfd] via-white to-[#f5f8fc] px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#e87722] flex items-center justify-center font-black text-[#0f2557]">
            B
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-[#0f2557]">BNS</div>
            <div className="text-[10px] font-semibold tracking-widest text-[#e87722]">
              SERVICES
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
          {!success ? (
            <>
              <h1 className="text-2xl font-black text-[#0f2557] mb-1 text-center">
                Nouveau mot de passe
              </h1>
              <p className="text-gray-500 text-sm text-center mb-6">
                Choisis un nouveau mot de passe sécurisé pour ton compte.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-semibold text-[#0f2557] mb-1.5">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-gray-200 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 outline-none transition-all duration-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f2557] transition-colors duration-200"
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-1.5">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              i < passwordStrength ? strengthColor : 'bg-gray-150'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{strengthLabel}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f2557] mb-1.5">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas.</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#e87722] hover:bg-[#0f2557] text-[#0f2557] hover:text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-60"
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={32} />
                </div>
              </div>
              <h2 className="text-xl font-black text-[#0f2557]">
                Mot de passe modifié !
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Ton mot de passe a été réinitialisé avec succès. Tu peux maintenant te connecter avec ton nouveau mot de passe.
              </p>
              <button
                onClick={() => navigate('/connexion')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#e87722] px-6 py-3 font-bold text-[#0f2557] transition hover:bg-[#e87722]"
              >
                Se connecter
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link
            to="/connexion"
            className="inline-flex items-center gap-1.5 font-semibold text-[#0f2557] hover:text-[#e87722] transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}
