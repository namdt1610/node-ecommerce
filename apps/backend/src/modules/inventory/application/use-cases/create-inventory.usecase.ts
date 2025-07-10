import { IInventoryRepository } from '../../domain/interfaces/inventory-repository.interface'
import {
    Inventory,
    CreateInventoryData,
} from '../../domain/entities/inventory.entity'

export class CreateInventoryUseCase {
    constructor(private inventoryRepository: IInventoryRepository) {}

    async execute(createData: CreateInventoryData): Promise<Inventory> {
        // Check if inventory already exists for this product
        const existingInventory =
            await this.inventoryRepository.findByProductId(createData.productId)

        if (existingInventory) {
            throw new Error('Inventory already exists for this product')
        }

        // Check if SKU is unique
        const existingSku = await this.inventoryRepository.findBySku(
            createData.sku
        )
        if (existingSku) {
            throw new Error('SKU already exists')
        }

        // Create inventory
        const inventory = await this.inventoryRepository.create({
            ...createData,
            allowBackorder: createData.allowBackorder ?? false,
        })

        return inventory
    }
}
