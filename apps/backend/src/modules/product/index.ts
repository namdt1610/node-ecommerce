// Export product routes
export { productModuleRoutes as productRoutes } from './routes'

// Export product types and DTOs
export * from './application/dto/product.dto'

// Export product controller for testing
export { createProductController } from './container'
