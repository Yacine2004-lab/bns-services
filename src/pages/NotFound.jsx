import { Link } from 'react-router-dom'
import { Package, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#e87722]/20 to-[#e87722]/5">
        <Package size={48} className="text-[#e87722]" />
      </div>

      <h1 className="text-6xl font-black tracking-tight text-[#0f2557]">404</h1>
      <p className="mt-3 text-xl font-semibold text-[#0f2557]">Page introuvable</p>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#e87722] px-6 py-3 font-bold text-[#0f2557] transition hover:bg-[#e87722] hover:shadow-lg"
      >
        <ArrowLeft size={18} />
        Retour à l'accueil
      </Link>
    </div>
  )
}
