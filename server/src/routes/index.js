import { Router } from 'express'
import categoryRoutes from './categoryRoutes.js'
import productRoutes from './productRoutes.js'
import authRoutes from './authRoutes.js'
import adminAuthRoutes from './adminAuthRoutes.js'
import orderRoutes from './orderRoutes.js'
import adminOrderRoutes from './adminOrderRoutes.js'
import adminCustomerRoutes from './adminCustomerRoutes.js'
import adminSettingsRoutes from './adminSettingsRoutes.js'
import uploadRoutes from './uploadRoutes.js'

const apiRouter = Router()

// Route de vérification de l'état du serveur (Health check)
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API BNS Services opérationnelle ! 🚀',
    timestamp: new Date().toISOString(),
  })
})

// Montage des routes métiers
apiRouter.use('/auth', authRoutes)
apiRouter.use('/admin', adminAuthRoutes)
apiRouter.use('/admin', adminOrderRoutes)
apiRouter.use('/admin', adminCustomerRoutes)
apiRouter.use('/admin', adminSettingsRoutes)
apiRouter.use('/admin', uploadRoutes)
apiRouter.use('/', categoryRoutes)
apiRouter.use('/', productRoutes)
apiRouter.use('/', orderRoutes)

export default apiRouter
