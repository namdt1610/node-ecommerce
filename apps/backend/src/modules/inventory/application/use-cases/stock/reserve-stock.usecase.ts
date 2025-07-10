import { InventoryReadRepository } from '../../../infrastructure/repositories/inventory-read.repository'
import { InventoryWriteRepository } from '../../../infrastructure/repositories/inventory-write.repository'
import { InventoryValidator } from '../../validators/inventory.validator'
import { InventoryDomainService } from '../../../domain/services/inventory-domain.service'
import {
    InventoryMovementType,
    InventoryReferenceType,
} from '../../../domain/entities/inventory.entity'

export interface ReserveStockRequest {
    productId: string
    quantity: number
    referenceId?: string
    referenceType?: InventoryReferenceType
    reason?: string
    userId?: string
}

export interface ReserveStockResult {
    success: boolean
    message: string
    inventoryId?: string
}

export class ReserveStockUseCase {
    constructor(
        private readRepository: InventoryReadRepository,
        private writeRepository: InventoryWriteRepository
    ) {}

    async execute(request: ReserveStockRequest): Promise<ReserveStockResult> {
        // Validate input
        InventoryValidator.validateReserveQuantity(request.quantity)

        // Find inventory
        const inventory = await this.readRepository.findByProductId(
            request.productId
        )
        if (!inventory) {
            return {
                success: false,
                message: 'Inventory not found for this product',
            }
        }

        // Check if reservation is possible
        const canReserve = InventoryDomainService.canReserveStock(
            inventory,
            request.quantity
        )
        if (!canReserve.canReserve) {
            return {
                success: false,
                message: canReserve.reason || 'Cannot reserve stock',
            }
        }

        // Reserve the stock
        const success = await this.writeRepository.reserveStock(
            inventory.id,
            request.quantity
        )

        if (!success) {
            return {
                success: false,
                message: 'Failed to reserve stock due to concurrent access',
            }
        }

        // Create movement record
        await this.writeRepository.createMovement({
            inventoryId: inventory.id,
            type: InventoryMovementType.RESERVATION,
            quantity: request.quantity,
            referenceId: request.referenceId,
            referenceType:
                request.referenceType || InventoryReferenceType.MANUAL,
            reason: request.reason || 'Stock reservation',
            unitCost: inventory.unitCost,
            totalCost: inventory.unitCost * request.quantity,
            userId: request.userId,
        })

        return {
            success: true,
            message: 'Stock reserved successfully',
            inventoryId: inventory.id,
        }
    }
}
