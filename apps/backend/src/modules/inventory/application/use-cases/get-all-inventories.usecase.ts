import { IInventoryRepository } from '../../domain/interfaces/inventory-repository.interface'
import { Inventory } from '../../domain/entities/inventory.entity'

export interface GetAllInventoriesOptions {
    skip?: number
    take?: number
    warehouseId?: string
    lowStock?: boolean
    expired?: boolean
    search?: string
}

export class GetAllInventoriesUseCase {
    constructor(private inventoryRepository: IInventoryRepository) {}

    async execute(options: GetAllInventoriesOptions = {}): Promise<{
        inventories: Inventory[]
        total: number
        hasMore: boolean
    }> {
        const result = await this.inventoryRepository.findAll(options)

        const hasMore = options.take
            ? (options.skip || 0) + result.inventories.length < result.total
            : false

        return {
            inventories: result.inventories,
            total: result.total,
            hasMore,
        }
    }
}
