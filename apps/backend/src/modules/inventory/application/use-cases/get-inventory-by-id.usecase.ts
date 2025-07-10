import { IInventoryRepository } from '../../domain/interfaces/inventory-repository.interface'
import { Inventory } from '../../domain/entities/inventory.entity'

export class GetInventoryByIdUseCase {
    constructor(private inventoryRepository: IInventoryRepository) {}

    async execute(id: string): Promise<Inventory | null> {
        if (!id) {
            throw new Error('Inventory ID is required')
        }

        const inventory = await this.inventoryRepository.findById(id)

        if (!inventory) {
            return null
        }

        return inventory
    }
}
