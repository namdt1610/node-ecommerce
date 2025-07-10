// Re-export main inventory components
export { inventoryModuleRoutes } from './routes'
export { createInventoryContainer } from './container'

// Export refactored components for direct usage
export { InventoryReadController } from './presentation/controllers/inventory-read.controller'
export { InventoryWriteController } from './presentation/controllers/inventory-write.controller'

// Export specialized repositories
export { InventoryReadRepository } from './infrastructure/repositories/inventory-read.repository'
export { InventoryWriteRepository } from './infrastructure/repositories/inventory-write.repository'

// Export domain services and value objects
export { InventoryDomainService } from './domain/services/inventory-domain.service'
export { StockQuantity } from './domain/value-objects/stock-quantity.vo'
export { CostCalculator } from './domain/value-objects/cost-calculator.vo'

// Export application services
export { InventoryValidator } from './application/validators/inventory.validator'
export { InventoryMapper } from './application/mappers/inventory.mapper'

// Export specialized use cases
export { ReserveStockUseCase } from './application/use-cases/stock/reserve-stock.usecase'
export { ReleaseStockUseCase } from './application/use-cases/stock/release-stock.usecase'

// Export legacy components for backward compatibility
export { CreateInventoryUseCase } from './application/use-cases/create-inventory.usecase'
export { GetInventoryByIdUseCase } from './application/use-cases/get-inventory-by-id.usecase'
export { GetAllInventoriesUseCase } from './application/use-cases/get-all-inventories.usecase'
export { UpdateInventoryUseCase } from './application/use-cases/update-inventory.usecase'
export { CheckAvailabilityUseCase } from './application/use-cases/check-availability.usecase'

// Export domain entities and interfaces
export * from './domain/entities/inventory.entity'
export * from './domain/interfaces/inventory-repository.interface'

// Export DTOs
export * from './application/dto/inventory.dto'
