"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInventoryUseCase = void 0;
class CreateInventoryUseCase {
    inventoryRepository;
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }
    async execute(createData) {
        // Check if inventory already exists for this product
        const existingInventory = await this.inventoryRepository.findByProductId(createData.productId);
        if (existingInventory) {
            throw new Error('Inventory already exists for this product');
        }
        // Check if SKU is unique
        const existingSku = await this.inventoryRepository.findBySku(createData.sku);
        if (existingSku) {
            throw new Error('SKU already exists');
        }
        // Create inventory
        const inventory = await this.inventoryRepository.create({
            ...createData,
            allowBackorder: createData.allowBackorder ?? false,
        });
        return inventory;
    }
}
exports.CreateInventoryUseCase = CreateInventoryUseCase;
