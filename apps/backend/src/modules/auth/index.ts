// Export auth routes
export { authModuleRoutes as authRoutes } from './routes'

// Export auth types and DTOs
export * from './application/dto'

// Export auth controller for testing
export { createAuthController } from './container'
