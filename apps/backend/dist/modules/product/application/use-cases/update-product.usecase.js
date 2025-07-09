"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductUseCase = void 0;
const product_mapper_1 = require("../mappers/product.mapper");
class UpdateProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id, updateProductDto) {
        const updateData = { ...updateProductDto };
        if (updateProductDto.categoryId) {
            updateData.category = {
                connect: { id: updateProductDto.categoryId },
            };
            delete updateData.categoryId;
        }
        const product = await this.productRepository.update(id, updateData);
        return (0, product_mapper_1.mapProductToResponseDto)(product);
    }
}
exports.UpdateProductUseCase = UpdateProductUseCase;
