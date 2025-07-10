import { Router } from 'express'
import { InventoryContainer } from './container'
import { asyncHandler } from '@/utils/async-handler'
import { BaseContainer } from '@/core/base-container'

export function inventoryModuleRoutes(global: BaseContainer): Router {
    const router = Router()
    const container = new InventoryContainer(global)

    const { readController, writeController } = container.getControllers()

    // Read Operations
    router.get('/', asyncHandler(readController.getAllInventories))
    router.get('/stats', asyncHandler(readController.getInventoryStats))
    router.get('/:id', asyncHandler(readController.getInventoryById))
    router.get(
        '/:productId/availability',
        asyncHandler(readController.checkAvailability)
    )

    // Write Operations
    router.post('/', asyncHandler(writeController.createInventory))
    router.put('/:id', asyncHandler(writeController.updateInventory))
    router.delete('/:id', asyncHandler(writeController.deleteInventory))

    // Stock Operations
    router.post('/reserve', asyncHandler(writeController.reserveStock))
    router.post('/release', asyncHandler(writeController.releaseStock))

    return router
}
