// Export payment routes
export { paymentModuleRoutes as paymentRoutes } from './routes'

// Export payment types and DTOs
export * from './application/dto/payment.dto'

// Export payment controller for testing
export { createPaymentController } from './container'

// Export interfaces
export * from './domain/interfaces/payment-gateway.interface'
