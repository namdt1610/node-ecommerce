import { IInventoryRepository } from '../../domain/interfaces/inventory-repository.interface'
import {
    Inventory,
    UpdateInventoryData,
} from '../../domain/entities/inventory.entity'

export class UpdateInventoryUseCase {
    constructor(private inventoryRepository: IInventoryRepository) {}

    async execute(
        id: string,
        updateData: UpdateInventoryData
    ): Promise<Inventory> {
        // Check if inventory exists
        const existingInventory = await this.inventoryRepository.findById(id)
        if (!existingInventory) {
            throw new Error('Inventory not found')
        }

        // Validate business rules
        if (updateData.totalQuantity !== undefined) {
            if (updateData.totalQuantity < existingInventory.reservedQuantity) {
                throw new Error(
                    'Total quantity cannot be less than reserved quantity'
                )
            }
        }

        if (
            updateData.lowStockThreshold !== undefined &&
            updateData.lowStockThreshold < 0
        ) {
            throw new Error(
                'Low stock threshold must be greater than or equal to 0'
            )
        }

        if (
            updateData.reorderPoint !== undefined &&
            updateData.reorderPoint < 0
        ) {
            throw new Error('Reorder point must be greater than or equal to 0')
        }

        if (
            updateData.reorderQuantity !== undefined &&
            updateData.reorderQuantity <= 0
        ) {
            throw new Error('Reorder quantity must be greater than 0')
        }

        // Update inventory
        const updatedInventory = await this.inventoryRepository.update(
            id,
            updateData
        )

        return updatedInventory
    }
}
