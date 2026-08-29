// Middleware générique de validation des requêtes avec Zod
export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      // Injecter les données validées et nettoyées
      req.body = parsed.body ?? req.body
      req.query = parsed.query ?? req.query
      req.params = parsed.params ?? req.params
      next()
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.map((e) => ({
          field: e.path.join('.').replace(/^(body|query|params)\./, ''),
          message: e.message,
        }))
        return res.status(400).json({
          success: false,
          message: 'Données fournies invalides.',
          errors: formattedErrors,
        })
      }
      next(err)
    }
  }
}
