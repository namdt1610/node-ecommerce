import { Router } from 'express'
import { config, validateEnv } from '../config/env'

const router = Router()
const NODE_ENV = config.server.nodeEnv

router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Server is running',
        environment: NODE_ENV,
    })
})

router.get('/api', (req, res) => {
    res.json({
        message: 'NodeApple API',
        version: '1.0.0',
        environment: NODE_ENV,
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            categories: '/api/categories',
            products: '/api/products',
            orders: '/api/orders',
            cart: '/api/cart',
            reviews: '/api/reviews',
        },
        documentation: 'API documentation available at /api/docs',
        status: 'All systems operational',
    })
})

export default router
