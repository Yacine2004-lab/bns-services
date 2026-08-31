import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { setToken, authApi } from "../lib/api";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function Signup() {
  const { registerClient } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/mon-compte";

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthProviders, setOauthProviders] = useState({ google: true, facebook: true });
  const [oauthError, setOauthError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Charger le statut OAuth au montage
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
        setOauthProviders({ google: false, facebook: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Gerer le callback OAuth (meme logique que Login.jsx)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");
    const oauthError = params.get("error");
    const oauthErrorProvider = params.get("provider");

    if (oauthToken) {
      setToken(oauthToken);
      localStorage.setItem("bns_client_token", oauthToken);
      window.history.replaceState({}, "", "/inscription");
      navigate(redirectTo, { replace: true });
    }
    if (oauthError) {
      let msg = "Inscription annulee ou echouee. Reessaie.";
      if (oauthError === "oauth_not_configured") {
        const prov = oauthErrorProvider === "facebook" ? "Facebook" : oauthErrorProvider === "google" ? "Google" : "ce provider";
        msg = `L'inscription via ${prov} n'est pas encore disponible. Cree ton compte avec le formulaire ci-dessous.`;
      } else if (oauthError === "oauth_invalid_state" || oauthError === "oauth_state_expired") {
        msg = "Session expiree. Reessaie depuis le formulaire.";
      } else if (oauthError === "oauth_denied") {
        msg = "Tu as refuse l'autorisation. Tu peux reessayer ou creer un compte avec email.";
      }
      setOauthError(msg);
      window.history.replaceState({}, "", "/inscription");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0 à 4
  })();

  const strengthLabel = ["Trop faible", "Faible", "Correct", "Bon", "Excellent"][
    passwordStrength
  ];
  const strengthColor = [
    "bg-red-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-lime-500",
    "bg-emerald-500",
  ][passwordStrength];

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Prénom requis.";
    if (!form.lastName.trim()) next.lastName = "Nom requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Email invalide.";
    if (!/^(\+221)?(70|75|76|77|78)\d{7}$/.test(form.phone.replace(/\s/g, "")))
      next.phone = "Numéro sénégalais invalide (ex: 77 123 45 67).";
    if (form.password.length < 8)
      next.password = "8 caractères minimum.";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Les mots de passe ne correspondent pas.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const { confirmPassword, ...payload } = form;
      await registerClient(payload);
      navigate("/mon-compte");
    } catch (err) {
      setErrors({ global: err.message || "Une erreur est survenue, réessaie." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-2.5 rounded-xl border outline-none transition-all duration-200 text-sm ${errors[field]
      ? "border-red-300 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20"
    }`;

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
          <h1 className="text-2xl font-black text-[#0f2557] mb-1 text-center">
            Créer un compte
          </h1>
          <p className="text-gray-500 text-sm text-center mb-7">
            Rejoins BNS Services en quelques secondes
          </p>

          {oauthError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <span className="font-semibold">Info :</span>
              <span>{oauthError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Boutons de connexion sociale */}
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={!oauthProviders.google}
                onClick={() => (oauthProviders.google && (window.location.href = `${API_BASE}/auth/google`))}
                title={!oauthProviders.google ? "Inscription Google temporairement indisponible" : undefined}
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
                {oauthProviders.google ? "S'inscrire avec Google" : 'Google indisponible'}
              </button>

              <button
                type="button"
                disabled={!oauthProviders.facebook}
                onClick={() => (oauthProviders.facebook && (window.location.href = `${API_BASE}/auth/facebook`))}
                title={!oauthProviders.facebook ? "Inscription Facebook temporairement indisponible" : undefined}
                className={`w-full flex items-center justify-center gap-3 rounded-xl py-3 transition-all duration-200 text-sm font-semibold ${
                  oauthProviders.facebook
                    ? 'bg-[#1877F2] hover:bg-[#166FE5] text-white cursor-pointer'
                    : 'bg-[#1877F2]/40 text-white/80 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {oauthProviders.facebook ? "S'inscrire avec Facebook" : 'Facebook indisponible'}
              </button>
            </div>

            {/* Separateur */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OU</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0f2557] mb-1.5">
                  Prénom
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={form.firstName}
                    onChange={update("firstName")}
                    placeholder="Awa"
                    autoComplete="given-name"
                    className={inputClass("firstName")}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0f2557] mb-1.5">
                  Nom
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={form.lastName}
                    onChange={update("lastName")}
                    placeholder="Diop"
                    autoComplete="family-name"
                    className={inputClass("lastName")}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0f2557] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="toi@exemple.com"
                  autoComplete="email"
                  className={inputClass("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0f2557] mb-1.5">
                Téléphone
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="77 123 45 67"
                  autoComplete="tel"
                  className={inputClass("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0f2557] mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputClass("password") + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f2557]"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < passwordStrength ? strengthColor : "bg-gray-150"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">{strengthLabel}</p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
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
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputClass("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errors.global && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {errors.global}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#e87722] hover:bg-[#0f2557] text-[#0f2557] hover:text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#0f2557]/20 disabled:opacity-60 mt-2"
            >
              {isSubmitting ? "Création..." : "Créer mon compte"}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà inscrit ?{" "}
          <Link
            to="/connexion"
            className="font-semibold text-[#0f2557] hover:text-[#e87722] transition-colors duration-200"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
