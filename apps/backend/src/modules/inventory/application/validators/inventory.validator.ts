import {
    CreateInventoryData,
    UpdateInventoryData,
    InventoryStockMovement,
} from '../../domain/entities/inventory.entity'

export class InventoryValidator {
    static validateCreateData(data: CreateInventoryData): void {
        if (data.totalQuantity < 0) {
            throw new Error('Total quantity cannot be negative')
        }

        if (data.lowStockThreshold < 0) {
            throw new Error('Low stock threshold cannot be negative')
        }

        if (data.reorderPoint < 0) {
            throw new Error('Reorder point cannot be negative')
        }

        if (data.reorderQuantity <= 0) {
            throw new Error('Reorder quantity must be greater than zero')
        }

        if (data.unitCost < 0) {
            throw new Error('Unit cost cannot be negative')
        }

        if (data.backorderLimit !== undefined && data.backorderLimit < 0) {
            throw new Error('Backorder limit cannot be negative')
        }

        if (data.expiryDate && new Date(data.expiryDate) <= new Date()) {
            throw new Error('Expiry date must be in the future')
        }
    }

    static validateUpdateData(data: UpdateInventoryData): void {
        if (data.totalQuantity !== undefined && data.totalQuantity < 0) {
            throw new Error('Total quantity cannot be negative')
        }

        if (
            data.lowStockThreshold !== undefined &&
            data.lowStockThreshold < 0
        ) {
            throw new Error('Low stock threshold cannot be negative')
        }

        if (data.reorderPoint !== undefined && data.reorderPoint < 0) {
            throw new Error('Reorder point cannot be negative')
        }

        if (data.reorderQuantity !== undefined && data.reorderQuantity <= 0) {
            throw new Error('Reorder quantity must be greater than zero')
        }

        if (data.unitCost !== undefined && data.unitCost < 0) {
            throw new Error('Unit cost cannot be negative')
        }

        if (data.backorderLimit !== undefined && data.backorderLimit < 0) {
            throw new Error('Backorder limit cannot be negative')
        }

        if (data.expiryDate && new Date(data.expiryDate) <= new Date()) {
            throw new Error('Expiry date must be in the future')
        }
    }

    static validateStockMovement(movement: InventoryStockMovement): void {
        if (movement.quantity <= 0) {
            throw new Error('Movement quantity must be greater than zero')
        }

        if (!movement.reason || movement.reason.trim().length === 0) {
            throw new Error('Movement reason is required')
        }

        if (movement.unitCost !== undefined && movement.unitCost < 0) {
            throw new Error('Unit cost cannot be negative')
        }
    }

    static validateReserveQuantity(requestedQuantity: number): void {
        if (requestedQuantity <= 0) {
            throw new Error('Reserve quantity must be greater than zero')
        }
    }

    static validateSkuUniqueness(sku: string): void {
        if (!sku || sku.trim().length === 0) {
            throw new Error('SKU is required')
        }

        if (sku.length > 50) {
            throw new Error('SKU cannot exceed 50 characters')
        }

        // SKU format validation (alphanumeric + hyphens)
        const skuPattern = /^[A-Za-z0-9-]+$/
        if (!skuPattern.test(sku)) {
            throw new Error(
                'SKU can only contain alphanumeric characters and hyphens'
            )
        }
    }
}
