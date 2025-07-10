import { BaseContainer } from '@/core/base-container'
import { PrismaClient } from '@prisma/client'

// Repositories
import { InventoryReadRepository } from './infrastructure/repositories/inventory-read.repository'
import { InventoryWriteRepository } from './infrastructure/repositories/inventory-write.repository'
import { InventoryRepository } from './infrastructure/repositories/inventory.repository'
import { InventoryMovementRepository } from './infrastructure/repositories/inventory-movement.repository'
import { InventoryAlertRepository } from './infrastructure/repositories/inventory-alert.repository'
import { InventoryAnalyticsRepository } from './infrastructure/repositories/inventory-analytics.repository'
import { InventoryTransferRepository } from './infrastructure/repositories/inventory-transfer.repository'

// Use Cases
import { CreateInventoryUseCase } from './application/use-cases/create-inventory.usecase'
import { GetInventoryByIdUseCase } from './application/use-cases/get-inventory-by-id.usecase'
import { GetAllInventoriesUseCase } from './application/use-cases/get-all-inventories.usecase'
import { UpdateInventoryUseCase } from './application/use-cases/update-inventory.usecase'
import { CheckAvailabilityUseCase } from './application/use-cases/check-availability.usecase'
import { ReserveStockUseCase } from './application/use-cases/stock/reserve-stock.usecase'
import { ReleaseStockUseCase } from './application/use-cases/stock/release-stock.usecase'

// Controllers
import { InventoryReadController } from './presentation/controllers/inventory-read.controller'
import { InventoryWriteController } from './presentation/controllers/inventory-write.controller'

export class InventoryContainer extends BaseContainer {
    constructor(global: BaseContainer) {
        super()
        const prisma = global.resolve<PrismaClient>('prisma')
        this.registerDependencies(prisma)
    }

    private registerDependencies(prisma: PrismaClient): void {
        // Repositories
        this.registerLazy(
            'readRepository',
            () => new InventoryReadRepository(prisma)
        )
        this.registerLazy(
            'writeRepository',
            () => new InventoryWriteRepository(prisma)
        )
        this.registerLazy(
            'combinedRepository',
            () => new InventoryRepository(prisma)
        )
        this.registerLazy(
            'movementRepository',
            () => new InventoryMovementRepository(prisma)
        )
        this.registerLazy(
            'alertRepository',
            () => new InventoryAlertRepository(prisma)
        )
        this.registerLazy(
            'analyticsRepository',
            () => new InventoryAnalyticsRepository(prisma)
        )
        this.registerLazy(
            'transferRepository',
            () => new InventoryTransferRepository(prisma)
        )

        // Use Cases (Read)
        this.registerLazy(
            'getInventoryByIdUseCase',
            () =>
                new GetInventoryByIdUseCase(this.resolve('combinedRepository'))
        )
        this.registerLazy(
            'getAllInventoriesUseCase',
            () =>
                new GetAllInventoriesUseCase(this.resolve('combinedRepository'))
        )
        this.registerLazy(
            'checkAvailabilityUseCase',
            () =>
                new CheckAvailabilityUseCase(this.resolve('combinedRepository'))
        )

        // Use Cases (Write)
        this.registerLazy(
            'createInventoryUseCase',
            () => new CreateInventoryUseCase(this.resolve('combinedRepository'))
        )
        this.registerLazy(
            'updateInventoryUseCase',
            () => new UpdateInventoryUseCase(this.resolve('combinedRepository'))
        )
        this.registerLazy(
            'reserveStockUseCase',
            () =>
                new ReserveStockUseCase(
                    this.resolve('readRepository'),
                    this.resolve('writeRepository')
                )
        )
        this.registerLazy(
            'releaseStockUseCase',
            () =>
                new ReleaseStockUseCase(
                    this.resolve('readRepository'),
                    this.resolve('writeRepository')
                )
        )

        // Controllers
        this.registerLazy(
            'readController',
            () =>
                new InventoryReadController(
                    this.resolve('getInventoryByIdUseCase'),
                    this.resolve('getAllInventoriesUseCase'),
                    this.resolve('checkAvailabilityUseCase')
                )
        )

        this.registerLazy(
            'writeController',
            () =>
                new InventoryWriteController(
                    this.resolve('createInventoryUseCase'),
                    this.resolve('updateInventoryUseCase'),
                    this.resolve('reserveStockUseCase'),
                    this.resolve('releaseStockUseCase')
                )
        )
    }

    // Export để dùng ngoài route
    getControllers() {
        return {
            readController:
                this.resolve<InventoryReadController>('readController'),
            writeController:
                this.resolve<InventoryWriteController>('writeController'),
        }
    }
}
