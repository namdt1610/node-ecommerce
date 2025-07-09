"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.disconnectDB = exports.connectDB = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
// Validate environment variables
(0, env_1.validateEnv)();
// Database configuration
const databaseConfig = {
    url: env_1.config.database.url,
    log: env_1.config.server.nodeEnv === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    errorFormat: 'pretty',
};
// Create Prisma client with configuration
const prisma = globalThis.prisma ||
    new client_1.PrismaClient({
        datasources: {
            db: {
                url: databaseConfig.url,
            },
        },
        log: databaseConfig.log,
        errorFormat: databaseConfig.errorFormat,
    });
// Prevent multiple instances in development
if (env_1.config.server.nodeEnv !== 'production') {
    globalThis.prisma = prisma;
}
// Connection handling
prisma
    .$connect()
    .then(() => {
    console.log('Database connected successfully');
    console.log(`Environment: ${env_1.config.server.nodeEnv}`);
})
    .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
});
// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    try {
        await prisma.$disconnect();
        console.log('Database disconnected successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
exports.default = prisma;
// Export database utilities
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected');
    }
    catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log('✅ Database disconnected');
    }
    catch (error) {
        console.error('❌ Database disconnection error:', error);
        throw error;
    }
};
exports.disconnectDB = disconnectDB;
// Database health check
const healthCheck = async () => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return { status: 'healthy', timestamp: new Date().toISOString() };
    }
    catch (error) {
        console.error('❌ Database health check failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
            status: 'unhealthy',
            error: errorMessage,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.healthCheck = healthCheck;
