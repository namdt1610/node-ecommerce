/**
 * Centralized configuration management
 */
export class ConfigManager {
    private static instance: ConfigManager
    private config: any = {}

    private constructor() {
        this.loadConfig()
    }

    static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager()
        }
        return ConfigManager.instance
    }

    private loadConfig() {
        this.config = {
            // Server Configuration
            server: {
                port: parseInt(process.env.PORT || '3030'),
                host: process.env.HOST || 'localhost',
                nodeEnv: process.env.NODE_ENV || 'development',
                apiPrefix: process.env.API_PREFIX || '/api',
            },

            // Database Configuration
            database: {
                url: process.env.DATABASE_URL,
                maxConnections: parseInt(
                    process.env.DB_MAX_CONNECTIONS || '10'
                ),
                timeout: parseInt(process.env.DB_TIMEOUT || '30000'),
                ssl: process.env.DB_SSL === 'true',
                logging: process.env.DB_LOGGING === 'true',
            },

            // Authentication Configuration
            auth: {
                jwtSecret: process.env.JWT_SECRET,
                jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
                refreshTokenExpiresIn:
                    process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
                bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
                sessionSecret: process.env.SESSION_SECRET,
            },

            // Email Configuration
            email: {
                provider: process.env.EMAIL_PROVIDER || 'smtp',
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_SECURE === 'true',
                user: process.env.EMAIL_USER,
                password: process.env.EMAIL_PASSWORD,
                from: process.env.EMAIL_FROM || 'noreply@ecommerce.com',
            },

            // File Upload Configuration
            upload: {
                maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
                allowedTypes: (
                    process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf'
                ).split(','),
                uploadPath: process.env.UPLOAD_PATH || './uploads',
                cdnUrl: process.env.CDN_URL,
            },

            // Redis Configuration
            redis: {
                url: process.env.REDIS_URL,
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD,
                db: parseInt(process.env.REDIS_DB || '0'),
                ttl: parseInt(process.env.REDIS_TTL || '3600'),
            },

            // Payment Configuration
            payment: {
                stripe: {
                    secretKey: process.env.STRIPE_SECRET_KEY,
                    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
                    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                },
                paypal: {
                    clientId: process.env.PAYPAL_CLIENT_ID,
                    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
                    mode: process.env.PAYPAL_MODE || 'sandbox',
                },
            },

            // Logging Configuration
            logging: {
                level: process.env.LOG_LEVEL || 'info',
                format: process.env.LOG_FORMAT || 'combined',
                directory: process.env.LOG_DIRECTORY || './logs',
                maxFiles: parseInt(process.env.LOG_MAX_FILES || '14'),
                maxSize: process.env.LOG_MAX_SIZE || '20m',
            },

            // Rate Limiting Configuration
            rateLimit: {
                windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
                maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
                skipSuccessfulRequests:
                    process.env.RATE_LIMIT_SKIP_SUCCESS === 'true',
            },

            // CORS Configuration
            cors: {
                origin: process.env.CORS_ORIGIN || '*',
                credentials: process.env.CORS_CREDENTIALS === 'true',
                methods: (
                    process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE'
                ).split(','),
            },

            // Cache Configuration
            cache: {
                ttl: parseInt(process.env.CACHE_TTL || '3600'),
                checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '600'),
                maxKeys: parseInt(process.env.CACHE_MAX_KEYS || '1000'),
            },

            // Socket.IO Configuration
            socket: {
                pingTimeout: parseInt(
                    process.env.SOCKET_PING_TIMEOUT || '60000'
                ),
                pingInterval: parseInt(
                    process.env.SOCKET_PING_INTERVAL || '25000'
                ),
                cors: {
                    origin: process.env.SOCKET_CORS_ORIGIN || '*',
                    credentials: process.env.SOCKET_CORS_CREDENTIALS === 'true',
                },
            },

            // Business Configuration
            business: {
                currency: process.env.CURRENCY || 'VND',
                timezone: process.env.TIMEZONE || 'Asia/Ho_Chi_Minh',
                language: process.env.LANGUAGE || 'vi',
                taxRate: parseFloat(process.env.TAX_RATE || '0.1'),
                shippingRate: parseFloat(process.env.SHIPPING_RATE || '30000'),
                freeShippingThreshold: parseFloat(
                    process.env.FREE_SHIPPING_THRESHOLD || '500000'
                ),
            },

            // Feature Flags
            features: {
                enableRegistration: process.env.ENABLE_REGISTRATION !== 'false',
                enableEmailVerification:
                    process.env.ENABLE_EMAIL_VERIFICATION === 'true',
                enableSocialLogin: process.env.ENABLE_SOCIAL_LOGIN === 'true',
                enableReviews: process.env.ENABLE_REVIEWS !== 'false',
                enableWishlist: process.env.ENABLE_WISHLIST !== 'false',
                enableInventoryTracking:
                    process.env.ENABLE_INVENTORY_TRACKING !== 'false',
                enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
            },
        }
    }

    // Getter methods for each configuration section
    get server() {
        return this.config.server
    }
    get database() {
        return this.config.database
    }
    get auth() {
        return this.config.auth
    }
    get email() {
        return this.config.email
    }
    get upload() {
        return this.config.upload
    }
    get redis() {
        return this.config.redis
    }
    get payment() {
        return this.config.payment
    }
    get logging() {
        return this.config.logging
    }
    get rateLimit() {
        return this.config.rateLimit
    }
    get cors() {
        return this.config.cors
    }
    get cache() {
        return this.config.cache
    }
    get socket() {
        return this.config.socket
    }
    get business() {
        return this.config.business
    }
    get features() {
        return this.config.features
    }

    /**
     * Get configuration value by path
     */
    get(path: string, defaultValue?: any): any {
        const keys = path.split('.')
        let value = this.config

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key]
            } else {
                return defaultValue
            }
        }

        return value
    }

    /**
     * Set configuration value by path
     */
    set(path: string, value: any): void {
        const keys = path.split('.')
        let target = this.config

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            if (!(key in target) || typeof target[key] !== 'object') {
                target[key] = {}
            }
            target = target[key]
        }

        target[keys[keys.length - 1]] = value
    }

    /**
     * Validate required configuration
     */
    validateRequired(): string[] {
        const required = ['database.url', 'auth.jwtSecret']

        const missing: string[] = []

        for (const path of required) {
            if (!this.get(path)) {
                missing.push(path)
            }
        }

        return missing
    }

    /**
     * Check if running in development mode
     */
    isDevelopment(): boolean {
        return this.server.nodeEnv === 'development'
    }

    /**
     * Check if running in production mode
     */
    isProduction(): boolean {
        return this.server.nodeEnv === 'production'
    }

    /**
     * Check if running in test mode
     */
    isTest(): boolean {
        return this.server.nodeEnv === 'test'
    }

    /**
     * Get all configuration (for debugging)
     */
    getAll(): any {
        return { ...this.config }
    }

    /**
     * Reload configuration from environment
     */
    reload(): void {
        this.loadConfig()
    }
}

// Export singleton instance
export const config = ConfigManager.getInstance()
