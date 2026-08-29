import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import Toast from './Toast'

const WHATSAPP_NUMBER = '221784459510'

function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, j\'ai besoin d\'informations sur vos produits BNS Services.')}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 active:scale-95"
      aria-label="Nous contacter sur WhatsApp"
      title="Discuter sur WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.052 9.38L1.056 31.2l6.012-1.97A15.89 15.89 0 0 0 16.004 32C24.828 32 32 24.824 32 16S24.828 0 16.004 0Zm9.32 22.608c-.392 1.104-1.94 2.024-3.192 2.292-.86.18-1.98.324-5.748-1.236-4.828-2-7.932-6.904-8.172-7.22-.232-.316-1.94-2.584-1.94-4.928 0-2.344 1.228-3.5 1.664-3.976.392-.428 1.036-.624 1.648-.624.196 0 .372.008.532.016.476.02.716.048 1.032.804.392.94 1.344 3.276 1.46 3.516.12.236.236.548.076.864-.148.324-.276.468-.512.736-.236.268-.46.472-.696.76-.216.252-.46.52-.196.996.268.472 1.188 1.96 2.552 3.176 1.756 1.564 3.236 2.052 3.696 2.28.456.228.724.188.988-.112.272-.308 1.156-1.344 1.464-1.808.3-.456.608-.38 1.024-.228.42.148 2.668 1.256 3.124 1.488.456.228.76.34.872.536.116.192.116 1.116-.276 2.22Z" />
      </svg>
    </a>
  )
}

function Layout() {
  return (
    <div className="min-h-screen text-slate-900 flex flex-col justify-between">
      <div>
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <Footer />
      
      {/* Bouton WhatsApp flottant */}
      <WhatsAppButton />

      {/* Composants globaux de commande */}
      <CartDrawer />
      <Toast />
    </div>
  )
}

export default Layout
