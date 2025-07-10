"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMapper = void 0;
class InventoryMapper {
    static toResponseDto(inventory) {
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
        };
    }
    static toMovementResponseDto(movement) {
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
        };
    }
    static toResponseDtoList(inventories) {
        return inventories.map((inventory) => this.toResponseDto(inventory));
    }
    static toMovementResponseDtoList(movements) {
        return movements.map((movement) => this.toMovementResponseDto(movement));
    }
    static toStatsResponseDto(data) {
        return {
            totalItems: data.totalItems,
            totalValue: data.totalValue,
            lowStockItems: data.lowStockItems,
            outOfStockItems: data.outOfStockItems,
            expiredItems: data.expiredItems,
            expiringItems: data.expiringItems,
        };
    }
    static calculateInventoryValue(inventories) {
        return inventories.reduce((total, inventory) => {
            return total + inventory.totalQuantity * inventory.averageCost;
        }, 0);
    }
    static filterLowStockItems(inventories) {
        return inventories.filter((inventory) => inventory.availableQuantity <= inventory.lowStockThreshold);
    }
    static filterOutOfStockItems(inventories) {
        return inventories.filter((inventory) => inventory.availableQuantity === 0);
    }
    static filterExpiredItems(inventories) {
        const now = new Date();
        return inventories.filter((inventory) => inventory.expiryDate && inventory.expiryDate < now);
    }
    static filterExpiringItems(inventories, daysThreshold = 30) {
        const now = new Date();
        const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
        return inventories.filter((inventory) => inventory.expiryDate &&
            inventory.expiryDate > now &&
            inventory.expiryDate <= thresholdDate);
    }
}
exports.InventoryMapper = InventoryMapper;
