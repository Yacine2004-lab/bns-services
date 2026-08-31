import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, AlertCircle } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { setToken, authApi } from "../lib/api";

export default function Login() {
  const { loginClient, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/mon-compte";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Statut des providers OAuth : true si configure cote serveur, false sinon
  const [oauthProviders, setOauthProviders] = useState({ google: true, facebook: true });

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Charger le statut OAuth au montage pour activer/desactiver les boutons
  useEffect(() => {
    let cancelled = false;
    authApi
      .getOAuthStatus()
      .then((res) => {
        if (cancelled) return;
        setOauthProviders(res?.providers || { google: false, facebook: false });
      })
      .catch(() => {
        if (cancelled) return;
        // En cas d'erreur, on suppose que rien n'est configure pour eviter les clics inutiles
        setOauthProviders({ google: false, facebook: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Gerer le callback OAuth (token dans l'URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");
    const oauthError = params.get("error");
    const oauthErrorProvider = params.get("provider");

    if (oauthToken) {
      setToken(oauthToken);
      localStorage.setItem("bns_client_token", oauthToken);
      window.history.replaceState({}, "", "/connexion");
      navigate(redirectTo, { replace: true });
    }
    if (oauthError) {
      // Messages d'erreur adaptes selon le contexte OAuth
      let msg = "Connexion annulee ou echouee. Reessaie.";
      if (oauthError === "oauth_not_configured") {
        const prov = oauthErrorProvider === "facebook" ? "Facebook" : oauthErrorProvider === "google" ? "Google" : "ce provider";
        msg = `La connexion via ${prov} n'est pas encore disponible. Utilise ton email et mot de passe.`;
      } else if (oauthError === "oauth_invalid_state" || oauthError === "oauth_state_expired") {
        msg = "Session de connexion expiree. Reessaie depuis le formulaire.";
      } else if (oauthError === "oauth_denied") {
        msg = "Tu as refuse l'autorisation. Tu peux reessayer ou utiliser ton email.";
      }
      setError(msg);
      window.history.replaceState({}, "", "/connexion");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Si déjà connecté à l'arrivée sur la page, rediriger immédiatement
  useEffect(() => {
    if (!loading && isAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Merci de renseigner ton email et ton mot de passe.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Cet email ne semble pas valide.");
      return;
    }

    try {
      setIsSubmitting(true);
      await loginClient({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Une erreur est survenue, réessaie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Colonne visuelle — visible uniquement à partir de desktop */}
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0f2557] via-[#142d60] to-[#0f2557] p-12 text-white">
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#e87722]/22 blur-[100px]" />
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-[#5b9fd4]/15 blur-[90px]" />
        <div className="absolute top-1/3 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/[0.04] blur-[70px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2557]/50 via-transparent to-transparent" />

        <Link to="/" className="relative flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-[#e87722] flex items-center justify-center font-black text-[#0f2557]">
            B
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight">BNS</div>
            <div className="text-[10px] font-semibold tracking-widest text-[#e87722]">
              SERVICES
            </div>
          </div>
        </Link>

        <div className="relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e87722]/40 text-[#e87722] text-xs font-semibold tracking-wide">
            <Zap size={14} /> ESPACE CLIENT
          </span>
          <h2 className="text-4xl font-black leading-tight">
            Retrouve tes commandes,
            <br />
            <span className="text-[#e87722]">en un instant.</span>
          </h2>
          <p className="text-white/70 max-w-sm leading-relaxed">
            Connecte-toi pour suivre tes commandes, gérer tes informations et
            profiter d'un passage en caisse plus rapide chez BNS Services.
          </p>
        </div>

        <div className="relative z-10 text-white/40 text-sm">
          © {new Date().getFullYear()} BNS Services — Sénégal
        </div>
      </div>

      {/* Colonne formulaire */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e87722] flex items-center justify-center font-black text-[#0f2557]">
              B
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-[#0f2557]">BNS</div>
              <div className="text-[10px] font-semibold tracking-widest text-[#e87722]">
                SERVICES
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-black text-[#0f2557] mb-1">
            Content de te revoir
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Connecte-toi à ton compte BNS Services
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Boutons de connexion sociale */}
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={!oauthProviders.google}
                onClick={() => (oauthProviders.google && (window.location.href = `${API_BASE}/auth/google`))}
                title={!oauthProviders.google ? "Connexion Google temporairement indisponible" : undefined}
                className={`w-full flex items-center justify-center gap-3 border rounded-xl py-3 transition-all duration-200 text-sm font-semibold ${
                  oauthProviders.google
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill={oauthProviders.google ? '#4285F4' : '#cbd5e1'}/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={oauthProviders.google ? '#34A853' : '#cbd5e1'}/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill={oauthProviders.google ? '#FBBC05' : '#cbd5e1'}/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={oauthProviders.google ? '#EA4335' : '#cbd5e1'}/>
                </svg>
                {oauthProviders.google ? 'Continuer avec Google' : 'Google indisponible'}
              </button>

              <button
                type="button"
                disabled={!oauthProviders.facebook}
                onClick={() => (oauthProviders.facebook && (window.location.href = `${API_BASE}/auth/facebook`))}
                title={!oauthProviders.facebook ? "Connexion Facebook temporairement indisponible" : undefined}
                className={`w-full flex items-center justify-center gap-3 rounded-xl py-3 transition-all duration-200 text-sm font-semibold ${
                  oauthProviders.facebook
                    ? 'bg-[#1877F2] hover:bg-[#166FE5] text-white cursor-pointer'
                    : 'bg-[#1877F2]/40 text-white/80 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {oauthProviders.facebook ? 'Continuer avec Facebook' : 'Facebook indisponible'}
              </button>
            </div>

            {/* Separateur */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OU</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0f2557] mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 outline-none transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#0f2557]">
                  Mot de passe
                </label>
                <Link
                  to="/mot-de-passe-oublie"
                  className="text-xs font-semibold text-[#e87722] hover:text-[#0f2557] transition-colors duration-200"
                >
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 outline-none transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f2557] transition-colors duration-200"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
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
              className="w-full flex items-center justify-center gap-2 bg-[#e87722] hover:bg-[#0f2557] text-[#0f2557] hover:text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#0f2557]/20 disabled:opacity-60 mt-2"
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Pas encore de compte ?{" "}
            <Link
              to="/inscription"
              className="font-semibold text-[#0f2557] hover:text-[#e87722] transition-colors duration-200"
            >
              Créer un compte
            </Link>
          </p>

          <p className="text-center mt-4">
            <Link
              to="/catalogue"
              className="text-sm text-gray-400 hover:text-[#e87722] transition-colors duration-200"
            >
              Continuer sans compte →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
