import { StockQuantity } from '../value-objects/stock-quantity.vo'
import { CostCalculator } from '../value-objects/cost-calculator.vo'
import { Inventory, InventoryMovementType } from '../entities/inventory.entity'

export class InventoryDomainService {
    static canReserveStock(
        inventory: Inventory,
        requestedQuantity: number
    ): { canReserve: boolean; reason?: string } {
        if (!inventory.isActive) {
            return { canReserve: false, reason: 'Inventory is not active' }
        }

        if (requestedQuantity <= inventory.availableQuantity) {
            return { canReserve: true }
        }

        if (!inventory.allowBackorder) {
            return {
                canReserve: false,
                reason: 'Insufficient stock and backorder not allowed',
            }
        }

        const shortfall = requestedQuantity - inventory.availableQuantity
        if (inventory.backorderLimit && shortfall > inventory.backorderLimit) {
            return { canReserve: false, reason: 'Exceeds backorder limit' }
        }

        return { canReserve: true }
    }

    static calculateStockUpdate(
        currentQuantity: StockQuantity,
        currentCost: CostCalculator,
        movementType: InventoryMovementType,
        quantity: number,
        unitCost?: number
    ): { quantity: StockQuantity; cost: CostCalculator } {
        let newQuantity: StockQuantity
        let newCost = currentCost

        switch (movementType) {
            case InventoryMovementType.STOCK_IN:
                newQuantity = currentQuantity.addStock(quantity)
                if (unitCost) {
                    newCost = currentCost.calculateNewAverageCost(
                        currentQuantity.total,
                        quantity,
                        unitCost
                    )
                }
                break

            case InventoryMovementType.STOCK_OUT:
                newQuantity = currentQuantity.removeStock(quantity)
                break

            case InventoryMovementType.RESERVATION:
                newQuantity = currentQuantity.reserve(quantity)
                break

            case InventoryMovementType.RELEASE:
                newQuantity = currentQuantity.release(quantity)
                break

            case InventoryMovementType.ADJUSTMENT:
                newQuantity = currentQuantity.adjustTo(quantity)
                break

            default:
                throw new Error(`Unsupported movement type: ${movementType}`)
        }

        return { quantity: newQuantity, cost: newCost }
    }

    static shouldCreateLowStockAlert(inventory: Inventory): boolean {
        return inventory.availableQuantity <= inventory.lowStockThreshold
    }

    static shouldCreateExpiryAlert(
        inventory: Inventory,
        daysThreshold: number = 30
    ): boolean {
        if (!inventory.expiryDate) return false

        const today = new Date()
        const daysUntilExpiry = Math.ceil(
            (inventory.expiryDate.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24)
        )

        return daysUntilExpiry <= daysThreshold
    }

    static isExpired(inventory: Inventory): boolean {
        if (!inventory.expiryDate) return false
        return inventory.expiryDate < new Date()
    }

    static calculateReorderRecommendation(inventory: Inventory): {
        shouldReorder: boolean
        recommendedQuantity?: number
        reason?: string
    } {
        if (inventory.availableQuantity > inventory.reorderPoint) {
            return { shouldReorder: false }
        }

        if (inventory.availableQuantity <= 0) {
            return {
                shouldReorder: true,
                recommendedQuantity: inventory.reorderQuantity,
                reason: 'Out of stock',
            }
        }

        return {
            shouldReorder: true,
            recommendedQuantity: inventory.reorderQuantity,
            reason: 'Below reorder point',
        }
    }
}
