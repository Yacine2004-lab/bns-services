import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "../context/useAuth";

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
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#122a4a] to-[#0d2240] p-12 text-white">
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#F5A623]/22 blur-[100px]" />
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-[#5b9fd4]/15 blur-[90px]" />
        <div className="absolute top-1/3 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/[0.04] blur-[70px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/50 via-transparent to-transparent" />

        <Link to="/" className="relative flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-[#F5A623] flex items-center justify-center font-black text-[#0B1F3A]">
            B
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight">BNS</div>
            <div className="text-[10px] font-semibold tracking-widest text-[#F5A623]">
              SERVICES
            </div>
          </div>
        </Link>

        <div className="relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F5A623]/40 text-[#F5A623] text-xs font-semibold tracking-wide">
            <Zap size={14} /> ESPACE CLIENT
          </span>
          <h2 className="text-4xl font-black leading-tight">
            Retrouve tes commandes,
            <br />
            <span className="text-[#F5A623]">en un instant.</span>
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
            <div className="w-10 h-10 rounded-xl bg-[#F5A623] flex items-center justify-center font-black text-[#0B1F3A]">
              B
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-[#0B1F3A]">BNS</div>
              <div className="text-[10px] font-semibold tracking-widest text-[#F5A623]">
                SERVICES
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-black text-[#0B1F3A] mb-1">
            Content de te revoir
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Connecte-toi à ton compte BNS Services
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
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
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 outline-none transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#0B1F3A]">
                  Mot de passe
                </label>
                <Link
                  to="/mot-de-passe-oublie"
                  className="text-xs font-semibold text-[#F5A623] hover:text-[#0B1F3A] transition-colors duration-200"
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
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 outline-none transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1F3A] transition-colors duration-200"
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
              className="w-full flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#0B1F3A] text-[#0B1F3A] hover:text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#0B1F3A]/20 disabled:opacity-60 mt-2"
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Pas encore de compte ?{" "}
            <Link
              to="/inscription"
              className="font-semibold text-[#0B1F3A] hover:text-[#F5A623] transition-colors duration-200"
            >
              Créer un compte
            </Link>
          </p>

          <p className="text-center mt-4">
            <Link
              to="/catalogue"
              className="text-sm text-gray-400 hover:text-[#F5A623] transition-colors duration-200"
            >
              Continuer sans compte →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
