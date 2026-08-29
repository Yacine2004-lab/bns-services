// Logger conditionnel : uniquement en développement
// En production, les erreurs sont silencieuses (pas de fuite d'info dans la console)
export function logError(message, error) {
  if (import.meta.env.DEV) {
    console.error(message, error)
  }
}
