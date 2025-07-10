"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAvailabilityUseCase = void 0;
class CheckAvailabilityUseCase {
    inventoryRepository;
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }
    async execute(productId, requestedQuantity) {
        if (requestedQuantity <= 0) {
            throw new Error('Requested quantity must be greater than 0');
        }
        // Find inventory for the product
        const inventory = await this.inventoryRepository.findByProductId(productId);
        if (!inventory) {
            return {
                isAvailable: false,
                availableQuantity: 0,
                requestedQuantity,
                canBackorder: false,
            };
        }
        if (!inventory.isActive) {
            return {
                isAvailable: false,
                availableQuantity: inventory.availableQuantity,
                requestedQuantity,
                canBackorder: false,
            };
        }
        const isAvailable = inventory.availableQuantity >= requestedQuantity;
        if (isAvailable) {
            return {
                isAvailable: true,
                availableQuantity: inventory.availableQuantity,
                requestedQuantity,
                canBackorder: false,
            };
        }
        // Check if backorder is possible
        if (inventory.allowBackorder) {
            const shortfall = requestedQuantity - inventory.availableQuantity;
            const canBackorder = inventory.backorderLimit
                ? shortfall <= inventory.backorderLimit
                : true;
            return {
                isAvailable: false,
                availableQuantity: inventory.availableQuantity,
                requestedQuantity,
                canBackorder,
                backorderQuantity: canBackorder ? shortfall : undefined,
            };
        }
        return {
            isAvailable: false,
            availableQuantity: inventory.availableQuantity,
            requestedQuantity,
            canBackorder: false,
        };
    }
}
exports.CheckAvailabilityUseCase = CheckAvailabilityUseCase;
