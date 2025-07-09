"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductByIdUseCase = void 0;
const product_mapper_1 = require("../mappers/product.mapper");
class GetProductByIdUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id) {
        const product = await this.productRepository.findById(id);
        if (!product)
            return null;
        return (0, product_mapper_1.mapProductToResponseDto)(product);
    }
}
exports.GetProductByIdUseCase = GetProductByIdUseCase;
