import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/useAuth'
import AccountDropdown from './AccountDropdown'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Accueil', path: '/' },
  { label: 'Catalogue', path: '/catalogue' },
  { label: 'À propos', path: '/a-propos' },
  { label: 'Contact', path: '/contact' },
]

function Header() {
  const { itemCount, openDrawer, badgeAnimated } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { isAuthenticated, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-[#0b1f3a]/70 text-white shadow-[0_8px_32px_rgba(11,31,58,0.2)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Accueil BNS Services">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#f9b448] via-[#f5a623] to-[#e78b0a] text-lg font-black text-[#0b1f3a] shadow-[0_10px_30px_rgba(245,166,35,0.35)]">
            B
          </div>
          <div className="leading-none">
            <div className="text-lg font-black tracking-[-0.04em] text-white">BNS</div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#f9b448]">Services</div>
          </div>
        </Link>

        {/* Bouton hamburger mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-200 hover:bg-white/10 hover:text-white md:hidden"
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-all duration-300 ${
                  isActive ? 'text-[#f9b448]' : 'text-slate-200 hover:text-white'
                } after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#f9b448] after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                  isActive ? 'after:scale-x-100' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Favoris */}
          <Link
            to="/wishlist"
            className="relative inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2.5 text-slate-200 backdrop-blur-md transition hover:border-[#f9b448]/50 hover:bg-white/15 hover:text-white"
            aria-label="Voir mes favoris"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Bouton Panier qui ouvre le CartDrawer */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2.5 text-slate-200 backdrop-blur-md transition hover:border-[#f9b448]/50 hover:bg-white/15 hover:text-white cursor-pointer"
            aria-label="Ouvrir le panier"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
              <path d="M3 4h2l2.2 9.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="18.5" r="1.5" />
              <circle cx="17" cy="18.5" r="1.5" />
            </svg>
            {itemCount > 0 && (
              <span
                className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f5a623] px-1 text-[10px] font-bold text-[#0b1f3a] transition-transform ${
                  badgeAnimated ? 'scale-125 bg-amber-400 ring-2 ring-white' : 'scale-100'
                }`}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* Icône Compte Unique avec Panneau Déroulant */}
          <AccountDropdown />
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <nav className="border-t border-white/10 bg-[#0b1f3a]/95 px-4 pb-4 pt-2 backdrop-blur-2xl md:hidden">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-white/10 text-[#f9b448]'
                        : 'text-slate-200 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {!isAuthenticated() && (
            <div className="mt-3 border-t border-white/10 pt-3 space-y-1">
              <Link
                to="/connexion"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                Se connecter
              </Link>
              <Link
                to="/inscription"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl bg-[#f5a623] px-4 py-3 text-center text-sm font-bold text-[#0b1f3a] transition hover:bg-[#f9b448]"
              >
                Créer un compte
              </Link>
            </div>
          )}
          {isAuthenticated() && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <Link
                to="/mon-compte"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-center text-sm font-bold text-[#f9b448] transition hover:bg-white/10"
              >
                Mon tableau de bord — {user?.firstName || 'Client'}
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}

export default Header
