"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductUseCase = void 0;
const product_mapper_1 = require("../mappers/product.mapper");
class CreateProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async execute(createProductDto) {
        const slug = this.generateSlug(createProductDto.name);
        const existingSlug = await this.productRepository.findBySlug(slug);
        if (existingSlug) {
            throw new Error('Product with similar name already exists');
        }
        const product = await this.productRepository.create({
            ...createProductDto,
            slug,
        });
        return (0, product_mapper_1.mapProductToResponseDto)(product);
    }
}
exports.CreateProductUseCase = CreateProductUseCase;
