import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export const config = {
    // Database
    database: {
        url: process.env.DATABASE_URL || '',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
        timeout: parseInt(process.env.DB_TIMEOUT || '30000'),
    },

    // Server
    server: {
        port: parseInt(process.env.PORT || '3001'),
        host: process.env.HOST || 'localhost',
        nodeEnv: process.env.NODE_ENV || 'development',
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'your-default-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },

    // Redis
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || '',
    },

    // Email
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@bookscape.com',
    },

    // File Upload
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5000000'), // 5MB
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
        uploadDir: process.env.UPLOAD_DIR || './uploads',
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://mern-psi-nine.vercel.app',
        ],
        credentials: true,
    },

    // Security
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    },
}

// Validate required environment variables
export const validateEnv = () => {
    const required = ['DATABASE_URL', 'JWT_SECRET']

    const missing = required.filter((key) => !process.env[key])

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        )
    }

    // Validate DATABASE_URL format
    if (!process.env.DATABASE_URL?.startsWith('postgresql://')) {
        throw new Error(
            'DATABASE_URL must be a valid PostgreSQL connection string'
        )
    }

    console.log('Environment variables validated successfully')
}

export default config
