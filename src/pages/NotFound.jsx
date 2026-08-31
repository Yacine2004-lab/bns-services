import { Link } from 'react-router-dom'
import { Package, ArrowLeft, Home, Search, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-10 text-center">
      {/* Decorations */}
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#e87722]/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
      <Sparkles className="absolute right-12 top-12 h-6 w-6 text-[#e87722]/30" />
      <Sparkles className="absolute left-16 bottom-16 h-8 w-8 text-blue-400/20" />

      <div className="relative">
        <div className="mb-6 inline-flex">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#e87722]/20 blur-2xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#e87722] to-[#f09050] text-white shadow-xl shadow-[#e87722]/30 sm:h-28 sm:w-28">
              <Package size={44} className="sm:hidden" />
              <Package size={52} className="hidden sm:block" />
            </div>
          </div>
        </div>

        <h1 className="bg-gradient-to-br from-[#0f2557] to-[#1a3a8a] bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
          404
        </h1>
        <p className="mt-2 text-xl font-black text-[#0f2557] sm:text-2xl">Page introuvable</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          Mais bonne nouvelle, notre catalogue vous attend !
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#e87722]/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#e87722]/30 active:scale-[0.98]"
          >
            <Home size={16} />
            Retour à l'accueil
          </Link>
          <Link
            to="/catalogue"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#0f2557] transition-all duration-200 hover:scale-[1.03] hover:border-[#e87722] hover:text-[#e87722] active:scale-[0.98]"
          >
            <Search size={16} />
            Parcourir le catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}
