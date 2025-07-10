import {
    Inventory,
    InventoryMovement,
    InventoryAlert,
} from '../../domain/entities/inventory.entity'
import {
    InventoryResponseDto,
    InventoryMovementResponseDto,
    InventoryStatsResponseDto,
} from '../dto/inventory.dto'

export class InventoryMapper {
    static toResponseDto(inventory: Inventory): InventoryResponseDto {
        return {
            id: inventory.id,
            productId: inventory.productId,
            warehouseId: inventory.warehouseId,
            sku: inventory.sku,
            totalQuantity: inventory.totalQuantity,
            availableQuantity: inventory.availableQuantity,
            reservedQuantity: inventory.reservedQuantity,
            lowStockThreshold: inventory.lowStockThreshold,
            allowBackorder: inventory.allowBackorder,
            backorderLimit: inventory.backorderLimit,
            reorderPoint: inventory.reorderPoint,
            reorderQuantity: inventory.reorderQuantity,
            unitCost: inventory.unitCost,
            averageCost: inventory.averageCost,
            location: inventory.location,
            batch: inventory.batch,
            expiryDate: inventory.expiryDate?.toISOString(),
            isTracked: inventory.isTracked,
            isActive: inventory.isActive,
            lastStockCheck: inventory.lastStockCheck?.toISOString(),
            notes: inventory.notes,
            createdAt: inventory.createdAt.toISOString(),
            updatedAt: inventory.updatedAt.toISOString(),
        }
    }

    static toMovementResponseDto(
        movement: InventoryMovement
    ): InventoryMovementResponseDto {
        return {
            id: movement.id,
            inventoryId: movement.inventoryId,
            type: movement.type,
            quantity: movement.quantity,
            referenceId: movement.referenceId,
            referenceType: movement.referenceType,
            reason: movement.reason,
            notes: movement.notes,
            unitCost: movement.unitCost,
            totalCost: movement.totalCost,
            userId: movement.userId,
            createdAt: movement.createdAt.toISOString(),
        }
    }

    static toResponseDtoList(inventories: Inventory[]): InventoryResponseDto[] {
        return inventories.map((inventory) => this.toResponseDto(inventory))
    }

    static toMovementResponseDtoList(
        movements: InventoryMovement[]
    ): InventoryMovementResponseDto[] {
        return movements.map((movement) => this.toMovementResponseDto(movement))
    }

    static toStatsResponseDto(data: {
        totalItems: number
        totalValue: number
        lowStockItems: number
        outOfStockItems: number
        expiredItems: number
        expiringItems: number
    }): InventoryStatsResponseDto {
        return {
            totalItems: data.totalItems,
            totalValue: data.totalValue,
            lowStockItems: data.lowStockItems,
            outOfStockItems: data.outOfStockItems,
            expiredItems: data.expiredItems,
            expiringItems: data.expiringItems,
        }
    }

    static calculateInventoryValue(inventories: Inventory[]): number {
        return inventories.reduce((total, inventory) => {
            return total + inventory.totalQuantity * inventory.averageCost
        }, 0)
    }

    static filterLowStockItems(inventories: Inventory[]): Inventory[] {
        return inventories.filter(
            (inventory) =>
                inventory.availableQuantity <= inventory.lowStockThreshold
        )
    }

    static filterOutOfStockItems(inventories: Inventory[]): Inventory[] {
        return inventories.filter(
            (inventory) => inventory.availableQuantity === 0
        )
    }

    static filterExpiredItems(inventories: Inventory[]): Inventory[] {
        const now = new Date()
        return inventories.filter(
            (inventory) => inventory.expiryDate && inventory.expiryDate < now
        )
    }

    static filterExpiringItems(
        inventories: Inventory[],
        daysThreshold: number = 30
    ): Inventory[] {
        const now = new Date()
        const thresholdDate = new Date(
            now.getTime() + daysThreshold * 24 * 60 * 60 * 1000
        )

        return inventories.filter(
            (inventory) =>
                inventory.expiryDate &&
                inventory.expiryDate > now &&
                inventory.expiryDate <= thresholdDate
        )
    }
}
