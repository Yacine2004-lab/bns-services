// Middleware de gestion centralisée des erreurs
// Intercepte toutes les erreurs non gérées et retourne une réponse JSON propre
export function errorHandler(err, req, res, next) {
  // En production, ne pas exposer les détails d'erreur dans les logs
  if (process.env.NODE_ENV === 'production') {
    console.error('Erreur serveur:', err.statusCode || 500, err.message)
  } else {
    console.error('❌ Erreur serveur :', err)
  }

  // Erreur métier contrôlée (400, 401, 404, 409, etc.) → on transmet le message
  const statusCode = err.statusCode || 500

  // Erreur inattendue (500) → message générique pour ne pas exposer de détails internes
  const message =
    statusCode === 500
      ? 'Une erreur interne est survenue sur le serveur. Veuillez réessayer plus tard.'
      : err.message || 'Une erreur interne est survenue sur le serveur.'

  res.status(statusCode).json({
    success: false,
    message,
    // Ne jamais exposer la stack trace en production
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}
