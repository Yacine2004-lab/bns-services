import { CheckCircle2, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { resolveImageUrl } from '../lib/resolveImageUrl'

export default function Toast() {
  const { toast, hideToast, openDrawer } = useCart()

  if (!toast.visible) return null

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3.5 rounded-2xl border border-white/40 bg-[#0f2557]/95 p-4 text-white shadow-[0_20px_50px_rgba(11,31,58,0.35)] backdrop-blur-xl">
        {toast.product?.image ? (
          <img
            src={resolveImageUrl(toast.product.image)}
            alt={toast.product.name || 'Produit'}
            className="h-12 w-12 rounded-xl object-contain bg-white/10 p-1 flex-shrink-0"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e87722] to-[#e87722] text-[#0f2557] flex-shrink-0">
            <CheckCircle2 size={20} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[#e87722]">
            Ajouté avec succès
          </p>
          <p className="text-sm font-semibold text-slate-100 truncate">
            {toast.message}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              hideToast()
              openDrawer()
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white hover:bg-[#e87722] hover:text-[#0f2557] transition-all"
          >
            <ShoppingBag size={13} />
            <span>Panier</span>
          </button>

          <button
            type="button"
            onClick={hideToast}
            className="rounded-lg p-1 text-slate-400 hover:text-white transition"
            aria-label="Fermer la notification"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
