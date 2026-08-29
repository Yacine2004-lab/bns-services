import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/useAuth";

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

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      : "border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20"
    }`;

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
          <h1 className="text-2xl font-black text-[#0B1F3A] mb-1 text-center">
            Créer un compte
          </h1>
          <p className="text-gray-500 text-sm text-center mb-7">
            Rejoins BNS Services en quelques secondes
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
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
                <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
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
              <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
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
              <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
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
              <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1F3A]"
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
              <label className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
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
              className="w-full flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#0B1F3A] text-[#0B1F3A] hover:text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#0B1F3A]/20 disabled:opacity-60 mt-2"
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
            className="font-semibold text-[#0B1F3A] hover:text-[#F5A623] transition-colors duration-200"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
