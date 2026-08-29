import { useContext } from "react";
import { AdminAuthContext } from "./AdminAuthContext.jsx";

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth doit être utilisé à l'intérieur d'un AdminAuthProvider");
  }
  return ctx;
}
