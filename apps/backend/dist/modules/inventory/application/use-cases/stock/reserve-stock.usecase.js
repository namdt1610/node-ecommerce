"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveStockUseCase = void 0;
const inventory_validator_1 = require("../../validators/inventory.validator");
const inventory_domain_service_1 = require("../../../domain/services/inventory-domain.service");
const inventory_entity_1 = require("../../../domain/entities/inventory.entity");
class ReserveStockUseCase {
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
        // Check if reservation is possible
        const canReserve = inventory_domain_service_1.InventoryDomainService.canReserveStock(inventory, request.quantity);
        if (!canReserve.canReserve) {
            return {
                success: false,
                message: canReserve.reason || 'Cannot reserve stock',
            };
        }
        // Reserve the stock
        const success = await this.writeRepository.reserveStock(inventory.id, request.quantity);
        if (!success) {
            return {
                success: false,
                message: 'Failed to reserve stock due to concurrent access',
            };
        }
        // Create movement record
        await this.writeRepository.createMovement({
            inventoryId: inventory.id,
            type: inventory_entity_1.InventoryMovementType.RESERVATION,
            quantity: request.quantity,
            referenceId: request.referenceId,
            referenceType: request.referenceType || inventory_entity_1.InventoryReferenceType.MANUAL,
            reason: request.reason || 'Stock reservation',
            unitCost: inventory.unitCost,
            totalCost: inventory.unitCost * request.quantity,
            userId: request.userId,
        });
        return {
            success: true,
            message: 'Stock reserved successfully',
            inventoryId: inventory.id,
        };
    }
}
exports.ReserveStockUseCase = ReserveStockUseCase;
