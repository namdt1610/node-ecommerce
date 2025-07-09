"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductsUseCase = void 0;
const product_dto_1 = require("../dto/product.dto");
class GetProductsUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(searchOptions) {
        // Validate input
        const validatedOptions = product_dto_1.ProductSearchSchema.parse(searchOptions);
        try {
            const result = await this.productRepository.search(validatedOptions);
            const totalPages = Math.ceil(result.total / validatedOptions.limit);
            return {
                products: result.products,
                total: result.total,
                hasMore: result.hasMore,
                page: validatedOptions.page,
                limit: validatedOptions.limit,
                totalPages,
            };
        }
        catch (error) {
            throw new Error('Failed to get products: ' + error.message);
        }
    }
    async getFeaturedProducts(limit = 10) {
        try {
            return await this.productRepository.findFeatured(limit);
        }
        catch (error) {
            throw new Error('Failed to get featured products: ' + error.message);
        }
    }
    async getPopularProducts(limit = 10) {
        try {
            return await this.productRepository.findPopular(limit);
        }
        catch (error) {
            throw new Error('Failed to get popular products: ' + error.message);
        }
    }
    async getRecentProducts(limit = 10) {
        try {
            return await this.productRepository.findRecentlyAdded(limit);
        }
        catch (error) {
            throw new Error('Failed to get recent products: ' + error.message);
        }
    }
    async getProductsOnSale(limit = 10) {
        try {
            return await this.productRepository.findOnSale(limit);
        }
        catch (error) {
            throw new Error('Failed to get products on sale: ' + error.message);
        }
    }
    async getProductsByCategory(categoryId, searchOptions) {
        try {
            const options = searchOptions
                ? product_dto_1.ProductSearchSchema.parse(searchOptions)
                : {
                    page: 1,
                    limit: 20,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                };
            const result = await this.productRepository.findByCategory(categoryId, options);
            const totalPages = Math.ceil(result.total / options.limit);
            return {
                products: result.products,
                total: result.total,
                hasMore: result.hasMore,
                page: options.page,
                limit: options.limit,
                totalPages,
            };
        }
        catch (error) {
            throw new Error('Failed to get products by category: ' +
                error.message);
        }
    }
    async getProductsByBrand(brand, searchOptions) {
        try {
            const options = searchOptions
                ? product_dto_1.ProductSearchSchema.parse(searchOptions)
                : {
                    page: 1,
                    limit: 20,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                };
            const result = await this.productRepository.findByBrand(brand, options);
            const totalPages = Math.ceil(result.total / options.limit);
            return {
                products: result.products,
                total: result.total,
                hasMore: result.hasMore,
                page: options.page,
                limit: options.limit,
                totalPages,
            };
        }
        catch (error) {
            throw new Error('Failed to get products by brand: ' + error.message);
        }
    }
    async getRelatedProducts(productId, limit = 5) {
        try {
            return await this.productRepository.findRelatedProducts(productId, limit);
        }
        catch (error) {
            throw new Error('Failed to get related products: ' + error.message);
        }
    }
    async getSimilarProducts(productId, limit = 5) {
        try {
            return await this.productRepository.findSimilarProducts(productId, limit);
        }
        catch (error) {
            throw new Error('Failed to get similar products: ' + error.message);
        }
    }
    async searchProducts(query, searchOptions) {
        try {
            const options = product_dto_1.ProductSearchSchema.parse({
                query,
                page: 1,
                limit: 20,
                sortBy: 'createdAt',
                sortOrder: 'desc',
                ...searchOptions,
            });
            const result = await this.productRepository.search(options);
            const totalPages = Math.ceil(result.total / options.limit);
            return {
                products: result.products,
                total: result.total,
                hasMore: result.hasMore,
                page: options.page,
                limit: options.limit,
                totalPages,
            };
        }
        catch (error) {
            throw new Error('Failed to search products: ' + error.message);
        }
    }
    async getMinimalProductData(searchOptions) {
        try {
            const validatedOptions = product_dto_1.ProductSearchSchema.parse(searchOptions);
            const result = await this.productRepository.findProductsWithMinimalData(validatedOptions);
            const totalPages = Math.ceil(result.total / validatedOptions.limit);
            return {
                products: result.products,
                total: result.total,
                page: validatedOptions.page,
                limit: validatedOptions.limit,
                totalPages,
            };
        }
        catch (error) {
            throw new Error('Failed to get minimal product data: ' +
                error.message);
        }
    }
}
exports.GetProductsUseCase = GetProductsUseCase;
