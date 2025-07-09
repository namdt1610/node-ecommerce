import { PrismaClient, Prisma } from '@prisma/client'
import { config, validateEnv } from './env'

// Validate environment variables
validateEnv()

declare global {
    var prisma: PrismaClient | undefined
}

// Database configuration
const databaseConfig = {
    url: config.database.url,
    log:
        config.server.nodeEnv === 'development'
            ? (['query', 'info', 'warn', 'error'] as Prisma.LogLevel[])
            : (['error'] as Prisma.LogLevel[]),
    errorFormat: 'pretty' as const,
}

// Create Prisma client with configuration
const prisma =
    globalThis.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: databaseConfig.url,
            },
        },
        log: databaseConfig.log,
        errorFormat: databaseConfig.errorFormat,
    })

// Prevent multiple instances in development
if (config.server.nodeEnv !== 'production') {
    globalThis.prisma = prisma
}

// Connection handling
prisma
    .$connect()
    .then(() => {
        console.log('Database connected successfully')
        console.log(`Environment: ${config.server.nodeEnv}`)
    })
    .catch((error) => {
        console.error('Database connection failed:', error)
        process.exit(1)
    })

// Graceful shutdown handlers
const gracefulShutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`)

    try {
        await prisma.$disconnect()
        console.log('Database disconnected successfully')
        process.exit(0)
    } catch (error) {
        console.error('Error during shutdown:', error)
        process.exit(1)
    }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('beforeExit', async () => {
    await prisma.$disconnect()
})

export default prisma

// Export database utilities
export const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log('Database connected')
    } catch (error) {
        console.error('Database connection error:', error)
        throw error
    }
}

export const disconnectDB = async () => {
    try {
        await prisma.$disconnect()
        console.log('✅ Database disconnected')
    } catch (error) {
        console.error('❌ Database disconnection error:', error)
        throw error
    }
}

// Database health check
export const healthCheck = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`
        return { status: 'healthy', timestamp: new Date().toISOString() }
    } catch (error) {
        console.error('❌ Database health check failed:', error)
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
        return {
            status: 'unhealthy',
            error: errorMessage,
            timestamp: new Date().toISOString(),
        }
    }
}
