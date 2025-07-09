"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductUseCase = void 0;
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
        // Check if slug already exists
        const existingSlug = await this.productRepository.findBySlug(slug);
        if (existingSlug) {
            throw new Error('Product with similar name already exists');
        }
        const product = await this.productRepository.create({
            ...createProductDto,
            slug,
        });
        return product;
    }
}
exports.CreateProductUseCase = CreateProductUseCase;
