"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInventoryByIdUseCase = void 0;
class GetInventoryByIdUseCase {
    inventoryRepository;
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }
    async execute(id) {
        if (!id) {
            throw new Error('Inventory ID is required');
        }
        const inventory = await this.inventoryRepository.findById(id);
        if (!inventory) {
            return null;
        }
        return inventory;
    }
}
exports.GetInventoryByIdUseCase = GetInventoryByIdUseCase;
