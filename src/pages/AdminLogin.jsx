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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo et branding admin */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 mb-4">
            <Shield size={32} className="text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Espace Administrateur</h1>
          <p className="text-slate-400 text-sm">BNS Services — Panel de gestion</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
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
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 outline-none transition-all duration-200 text-sm"
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
                  className="text-xs font-semibold text-[#e87722] hover:text-[#e87722] transition-colors duration-200"
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
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 outline-none transition-all duration-200 text-sm"
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
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#e87722] hover:bg-[#e87722] text-[#0f2557] font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#e87722]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Connexion..." : "Accéder au dashboard"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-500">
              Accès réservé au personnel autorisé
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          Accès réservé au personnel autorisé BNS Services
        </p>
      </div>
    </div>
  );
}