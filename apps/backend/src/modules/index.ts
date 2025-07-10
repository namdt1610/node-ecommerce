export * from './auth'
export * from './user'
export * from './category'
export * from './order'


// Product module exports (excluding conflicting types)
export { productRoutes as productModuleRoutes } from './product'
export { createProductController } from './product'

// Inventory module exports
export { inventoryModuleRoutes } from './inventory'
export { createInventoryContainer } from './inventory'
