import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Protège les pages nécessitant un compte client (checkout, confirmation…)
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e87722] mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  }

  return children;
}