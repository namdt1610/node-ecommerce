"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryDomainService = void 0;
const inventory_entity_1 = require("../entities/inventory.entity");
class InventoryDomainService {
    static canReserveStock(inventory, requestedQuantity) {
        if (!inventory.isActive) {
            return { canReserve: false, reason: 'Inventory is not active' };
        }
        if (requestedQuantity <= inventory.availableQuantity) {
            return { canReserve: true };
        }
        if (!inventory.allowBackorder) {
            return {
                canReserve: false,
                reason: 'Insufficient stock and backorder not allowed',
            };
        }
        const shortfall = requestedQuantity - inventory.availableQuantity;
        if (inventory.backorderLimit && shortfall > inventory.backorderLimit) {
            return { canReserve: false, reason: 'Exceeds backorder limit' };
        }
        return { canReserve: true };
    }
    static calculateStockUpdate(currentQuantity, currentCost, movementType, quantity, unitCost) {
        let newQuantity;
        let newCost = currentCost;
        switch (movementType) {
            case inventory_entity_1.InventoryMovementType.STOCK_IN:
                newQuantity = currentQuantity.addStock(quantity);
                if (unitCost) {
                    newCost = currentCost.calculateNewAverageCost(currentQuantity.total, quantity, unitCost);
                }
                break;
            case inventory_entity_1.InventoryMovementType.STOCK_OUT:
                newQuantity = currentQuantity.removeStock(quantity);
                break;
            case inventory_entity_1.InventoryMovementType.RESERVATION:
                newQuantity = currentQuantity.reserve(quantity);
                break;
            case inventory_entity_1.InventoryMovementType.RELEASE:
                newQuantity = currentQuantity.release(quantity);
                break;
            case inventory_entity_1.InventoryMovementType.ADJUSTMENT:
                newQuantity = currentQuantity.adjustTo(quantity);
                break;
            default:
                throw new Error(`Unsupported movement type: ${movementType}`);
        }
        return { quantity: newQuantity, cost: newCost };
    }
    static shouldCreateLowStockAlert(inventory) {
        return inventory.availableQuantity <= inventory.lowStockThreshold;
    }
    static shouldCreateExpiryAlert(inventory, daysThreshold = 30) {
        if (!inventory.expiryDate)
            return false;
        const today = new Date();
        const daysUntilExpiry = Math.ceil((inventory.expiryDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= daysThreshold;
    }
    static isExpired(inventory) {
        if (!inventory.expiryDate)
            return false;
        return inventory.expiryDate < new Date();
    }
    static calculateReorderRecommendation(inventory) {
        if (inventory.availableQuantity > inventory.reorderPoint) {
            return { shouldReorder: false };
        }
        if (inventory.availableQuantity <= 0) {
            return {
                shouldReorder: true,
                recommendedQuantity: inventory.reorderQuantity,
                reason: 'Out of stock',
            };
        }
        return {
            shouldReorder: true,
            recommendedQuantity: inventory.reorderQuantity,
            reason: 'Below reorder point',
        };
    }
}
exports.InventoryDomainService = InventoryDomainService;
