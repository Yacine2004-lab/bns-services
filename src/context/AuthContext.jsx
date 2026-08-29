import { createContext, useState, useEffect } from "react";
import { authApi, getToken, setToken, removeToken } from "../lib/api";

// Contexte d'authentification 100% dédié aux CLIENTS BNS Services.
// Aucune donnée admin n'est stockée ni gérée ici.
const AuthContext = createContext(null);

export { AuthContext };

// Contexte d'authentification 100% dédié aux CLIENTS BNS Services.
// Aucune donnée admin n'est stockée ni gérée ici.

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recharge la session client au démarrage via le token JWT
  useEffect(() => {
    async function loadSession() {
      // Nettoyage des anciennes clés obsolètes si elles existent
      try {
        localStorage.removeItem("bns_user");
        localStorage.removeItem("bns_client_user");
      } catch { /* Ignorer */ }

      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Vérifier que le token est encore valide
        const res = await authApi.getMe();
        setUser(res.data);
      } catch {
        // Token expiré ou invalide : nettoyer la session
        removeToken();
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  // Connexion client via l'API
  const loginClient = async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const { customer, token } = res.data;
    setToken(token);
    setUser(customer);
    return customer;
  };

  // Inscription client via l'API
  const registerClient = async ({ firstName, lastName, email, phone, password }) => {
    const res = await authApi.register({ firstName, lastName, email, phone, password });
    const { customer, token } = res.data;
    setToken(token);
    setUser(customer);
    return customer;
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  const isAuthenticated = () => user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginClient,
        registerClient,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


