import { createServer } from 'http'
import app from './app'
import prisma from './config/database'
import { config } from './config/env'
import {
    initializeSocketService,
    createDashboardController,
} from './modules/dashboard'

const PORT = config.server.port

const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect()
        console.log('Database connected successfully')

        // Create HTTP server
        const httpServer = createServer(app)

        // Initialize Socket.IO service
        const socketService = initializeSocketService(httpServer)
        console.log('Socket.IO service initialized')

        // Get Socket.IO instance for other services
        const io = socketService.getIO()

        // Create dashboard controller with HTTP server
        const dashboardController = createDashboardController(httpServer)

        // Inject dashboard controller into app for routes
        app.use('/api/dashboard', (req: any, res, next) => {
            req.dashboardController = dashboardController
            next()
        })

        // Initialize routes with Socket.IO instance
        const { registerAllRoutes } = await import('./routes')
        registerAllRoutes(app, io)

        console.log('Dashboard service initialized')

        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
            console.log(`Socket.IO endpoint: ws://localhost:${PORT}/socket.io`)
            console.log(`Dashboard API: http://localhost:${PORT}/api/dashboard`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully')
    await prisma.$disconnect()
    process.exit(0)
})

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully')
    await prisma.$disconnect()
    process.exit(0)
})

startServer()
