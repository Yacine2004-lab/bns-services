import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import { useAdminAuth } from "../context/useAdminAuth";

export default function AdminLogin() {
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email et mot de passe requis.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format d'email invalide.");
      return;
    }

    try {
      setIsSubmitting(true);
      await loginAdmin({ email, password });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(15,37,87,0.9),_rgba(2,6,23,1)_55%)] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-slate-500/70 bg-slate-800/70 shadow-[0_0_0_1px_rgba(148,163,184,0.2),0_20px_45px_rgba(15,23,42,0.45)] backdrop-blur-sm mb-5">
            <Shield size={34} className="text-slate-100" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">
            Espace Administrateur
          </h1>
          <p className="text-slate-400 text-sm tracking-wide">
            BNS Services — Panel de gestion
          </p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700/80 shadow-[0_25px_80px_rgba(15,23,42,0.55)] p-7 sm:p-8">
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
                  placeholder="contact@bayeniassservices.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/15 outline-none transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Mot de passe
                </label>
                <Link
                  to="/admin/mot-de-passe-oublie"
                  className="text-xs font-semibold text-[#f29a57] hover:text-[#ffb06a] transition-colors duration-200"
                >
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/15 outline-none transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
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
              <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#f28a35] to-[#e87722] hover:from-[#f79a4d] hover:to-[#e87722] text-[#0f2557] font-black py-3.5 rounded-xl transition-all duration-300 shadow-[0_18px_30px_rgba(232,119,34,0.35)] hover:-translate-y-0.5 hover:shadow-[0_20px_34px_rgba(232,119,34,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Connexion..." : "Accéder au dashboard"}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          Accès réservé au personnel autorisé
        </p>
      </div>
    </div>
  );
}