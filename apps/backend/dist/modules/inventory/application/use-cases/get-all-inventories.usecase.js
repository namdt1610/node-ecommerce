"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllInventoriesUseCase = void 0;
class GetAllInventoriesUseCase {
    inventoryRepository;
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }
    async execute(options = {}) {
        const result = await this.inventoryRepository.findAll(options);
        const hasMore = options.take
            ? (options.skip || 0) + result.inventories.length < result.total
            : false;
        return {
            inventories: result.inventories,
            total: result.total,
            hasMore,
        };
    }
}
exports.GetAllInventoriesUseCase = GetAllInventoriesUseCase;
