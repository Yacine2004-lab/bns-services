import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Heart,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useWishlist } from '../context/WishlistContext'

export default function AccountDropdown() {
  const { user, loginClient, logout, isAuthenticated } = useAuth()
  const { count: wishlistCount } = useWishlist()

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dropdownRef = useRef(null)

  // Ferme le menu en cliquant à l'extérieur ou avec Échap
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Email et mot de passe requis.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format d'email invalide.")
      return
    }

    try {
      setIsSubmitting(true)
      await loginClient({ email, password })
      setEmail('')
      setPassword('')
      setIsOpen(false)
    } catch (err) {
      setError(err.message || 'Identifiants incorrects.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 1. Bouton Compte dans le Header */}
      {isAuthenticated() ? (
        /* État Connecté */
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:border-[#f9b448]/50 hover:bg-white/15 cursor-pointer"
          aria-label="Mon compte"
          aria-expanded={isOpen}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5a623] text-[#0b1f3a] text-xs font-black shadow-xs">
            {user?.firstName ? user.firstName[0].toUpperCase() : 'C'}
          </div>
          <span className="hidden md:inline font-bold text-xs">
            {user?.firstName || 'Mon Compte'}
          </span>
        </button>
      ) : (
        /* État Non Connecté : Icône Compte Unique */
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2.5 text-slate-200 backdrop-blur-md transition hover:border-[#f9b448]/50 hover:bg-white/15 hover:text-white cursor-pointer"
          aria-label="Connexion et compte client"
          aria-expanded={isOpen}
        >
          <User size={19} />
        </button>
      )}

      {/* 2. Panneau Déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-84 max-w-[calc(100vw-2rem)] rounded-3xl border border-white/40 bg-white/95 p-5 shadow-[0_20px_50px_rgba(11,31,58,0.25)] backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2">
          {isAuthenticated() ? (
            /* CONTENU QUAND CONNECTÉ */
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="inline-block rounded-full bg-[#fef3d6] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#a66600]">
                  Espace Client
                </span>
                <p className="mt-1.5 text-base font-black text-[#0b1f3a] truncate">
                  {user?.firstName || ''} {user?.lastName || ''}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
              </div>

              <div className="space-y-1">
                <Link
                  to="/mon-compte"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#0b1f3a] hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <User size={16} className="text-[#f5a623]" />
                    <span>Mon tableau de bord</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-400" />
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart size={16} className="text-red-400" />
                    <span>Mes favoris</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          ) : (
            /* CONTENU QUAND NON CONNECTÉ : MINI-FORMULAIRE DE CONNEXION */
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#0b1f3a]">
                    Connexion
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#f5a623]">
                    Espace Client
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Accédez à votre compte BNS Services
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-red-600">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3" noValidate>
                {/* Champ Email */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre-email@exemple.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs text-[#0b1f3a] outline-none transition focus:border-[#f5a623] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Mot de passe
                    </label>
                    <Link
                      to="/connexion"
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] font-semibold text-[#f5a623] hover:underline"
                    >
                      Oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-9 py-2 text-xs text-[#0b1f3a] outline-none transition focus:border-[#f5a623] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>

                {/* Bouton Se connecter */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#f7b733] py-2.5 text-xs font-bold text-[#0b1f3a] shadow-md shadow-[#f5a623]/25 hover:shadow-lg transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Connexion...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Pied de panneau : Inscription */}
              <div className="border-t border-slate-100 pt-3 text-center">
                <p className="text-xs text-slate-500">
                  Pas de compte ?{' '}
                  <Link
                    to="/inscription"
                    onClick={() => setIsOpen(false)}
                    className="font-bold text-[#0b1f3a] hover:text-[#f5a623] transition underline"
                  >
                    S'inscrire
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
