"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductsCountUseCase = void 0;
class GetProductsCountUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(search, categoryId) {
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        return this.productRepository.count(where);
    }
}
exports.GetProductsCountUseCase = GetProductsCountUseCase;
