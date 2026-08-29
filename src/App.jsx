import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { ProductProvider } from './context/ProductContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'

// Code splitting : pages lourdes chargées à la demande
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminForgotPassword = lazy(() => import('./pages/AdminForgotPassword'))
const AdminResetPassword = lazy(() => import('./pages/AdminResetPassword'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const LegalPage = lazy(() => import('./pages/LegalPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Fallback de chargement commun
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e87722] border-t-transparent" />
    </div>
  )
}

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
            <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Auth client — pas de landing admin */}
              <Route path="/login" element={<Navigate to="/connexion" replace />} />
              <Route path="/connexion" element={<Login />} />
              <Route path="/inscription" element={<Signup />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
              <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />

              {/* Admin — URL connue du personnel uniquement, jamais liée depuis le site public */}
              <Route path="/admin/connexion" element={<AdminLogin />} />
              <Route path="/admin/mot-de-passe-oublie" element={<AdminForgotPassword />} />
              <Route path="/admin/reinitialiser-mot-de-passe" element={<AdminResetPassword />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Boutique publique */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="catalogue" element={<CatalogPage />} />
                <Route path="produit/:slug" element={<ProductPage />} />
                <Route path="panier" element={<CartPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route
                  path="mon-compte"
                  element={
                    <ProtectedRoute>
                      <ClientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="confirmation" element={<ConfirmationPage />} />
                <Route path="a-propos" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="conditions-generales" element={<LegalPage type="cgv" />} />
                <Route path="politique-de-confidentialite" element={<LegalPage type="privacy" />} />
                <Route path="mentions-legales" element={<LegalPage type="legal" />} />
              </Route>

              {/* 404 — page introuvable */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </AdminAuthProvider>
  )
}

export default App
