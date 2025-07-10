"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseStockUseCase = void 0;
const inventory_validator_1 = require("../../validators/inventory.validator");
const inventory_entity_1 = require("../../../domain/entities/inventory.entity");
class ReleaseStockUseCase {
    readRepository;
    writeRepository;
    constructor(readRepository, writeRepository) {
        this.readRepository = readRepository;
        this.writeRepository = writeRepository;
    }
    async execute(request) {
        // Validate input
        inventory_validator_1.InventoryValidator.validateReserveQuantity(request.quantity);
        // Find inventory
        const inventory = await this.readRepository.findByProductId(request.productId);
        if (!inventory) {
            return {
                success: false,
                message: 'Inventory not found for this product',
            };
        }
        // Check if release is possible
        if (request.quantity > inventory.reservedQuantity) {
            return {
                success: false,
                message: 'Cannot release more than reserved quantity',
            };
        }
        // Release the stock
        try {
            await this.writeRepository.releaseReservedStock(inventory.id, request.quantity);
            // Create movement record
            await this.writeRepository.createMovement({
                inventoryId: inventory.id,
                type: inventory_entity_1.InventoryMovementType.RELEASE,
                quantity: request.quantity,
                referenceId: request.referenceId,
                referenceType: request.referenceType || inventory_entity_1.InventoryReferenceType.MANUAL,
                reason: request.reason || 'Stock release',
                unitCost: inventory.unitCost,
                totalCost: inventory.unitCost * request.quantity,
                userId: request.userId,
            });
            return {
                success: true,
                message: 'Stock released successfully',
                inventoryId: inventory.id,
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to release stock: ${error.message}`,
            };
        }
    }
}
exports.ReleaseStockUseCase = ReleaseStockUseCase;
