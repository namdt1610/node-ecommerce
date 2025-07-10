import { InventoryReadRepository } from '../../../infrastructure/repositories/inventory-read.repository'
import { InventoryWriteRepository } from '../../../infrastructure/repositories/inventory-write.repository'
import { InventoryValidator } from '../../validators/inventory.validator'
import {
    InventoryMovementType,
    InventoryReferenceType,
} from '../../../domain/entities/inventory.entity'

export interface ReleaseStockRequest {
    productId: string
    quantity: number
    referenceId?: string
    referenceType?: InventoryReferenceType
    reason?: string
    userId?: string
}

export interface ReleaseStockResult {
    success: boolean
    message: string
    inventoryId?: string
}

export class ReleaseStockUseCase {
    constructor(
        private readRepository: InventoryReadRepository,
        private writeRepository: InventoryWriteRepository
    ) {}

    async execute(request: ReleaseStockRequest): Promise<ReleaseStockResult> {
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

        // Check if release is possible
        if (request.quantity > inventory.reservedQuantity) {
            return {
                success: false,
                message: 'Cannot release more than reserved quantity',
            }
        }

        // Release the stock
        try {
            await this.writeRepository.releaseReservedStock(
                inventory.id,
                request.quantity
            )

            // Create movement record
            await this.writeRepository.createMovement({
                inventoryId: inventory.id,
                type: InventoryMovementType.RELEASE,
                quantity: request.quantity,
                referenceId: request.referenceId,
                referenceType:
                    request.referenceType || InventoryReferenceType.MANUAL,
                reason: request.reason || 'Stock release',
                unitCost: inventory.unitCost,
                totalCost: inventory.unitCost * request.quantity,
                userId: request.userId,
            })

            return {
                success: true,
                message: 'Stock released successfully',
                inventoryId: inventory.id,
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to release stock: ${error.message}`,
            }
        }
    }
}
