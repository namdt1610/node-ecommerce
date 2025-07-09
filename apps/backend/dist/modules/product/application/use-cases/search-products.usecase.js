"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProductsUseCase = void 0;
class SearchProductsUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(searchOptions) {
        const { skip = 0, take = 10, search } = searchOptions;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const products = await this.productRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        });
        const total = await this.productRepository.count(where);
        const hasMore = skip + take < total;
        return {
            products,
            total,
            hasMore,
        };
    }
}
exports.SearchProductsUseCase = SearchProductsUseCase;
