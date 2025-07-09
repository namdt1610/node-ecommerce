"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllProductsUseCase = void 0;
const product_mapper_1 = require("../mappers/product.mapper");
class GetAllProductsUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(params) {
        const { skip, take, search, categoryId } = params || {};
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
        const products = await this.productRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        });
        return products.map(product_mapper_1.mapProductToResponseDto);
    }
}
exports.GetAllProductsUseCase = GetAllProductsUseCase;
