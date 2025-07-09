"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
class ProductService {
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
    async createProduct(createProductDto) {
        // Generate slug from name
        const slug = this.generateSlug(createProductDto.name);
        const product = (await this.productRepository.create({
            ...createProductDto,
            slug,
            category: {
                connect: { id: createProductDto.categoryId },
            },
        }));
        return this.mapToResponseDto(product);
    }
    async getProductById(id) {
        const product = (await this.productRepository.findById(id));
        if (!product) {
            return null;
        }
        return this.mapToResponseDto(product);
    }
    async getAllProducts(params) {
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
        const products = (await this.productRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        }));
        return products.map((product) => this.mapToResponseDto(product));
    }
    async updateProduct(id, updateProductDto) {
        const updateData = { ...updateProductDto };
        if (updateProductDto.categoryId) {
            updateData.category = {
                connect: { id: updateProductDto.categoryId },
            };
            delete updateData.categoryId;
        }
        const product = (await this.productRepository.update(id, updateData));
        return this.mapToResponseDto(product);
    }
    async deleteProduct(id) {
        await this.productRepository.delete(id);
    }
    async getProductsCount(params) {
        const { search, categoryId } = params || {};
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
    mapToResponseDto(product) {
        // Parse images from JSON
        const images = product.images
            ? JSON.parse(product.images)
            : [];
        const imageUrl = images.length > 0 ? images[0] : undefined;
        // Parse variants from JSON
        const variants = product.variants
            ? JSON.parse(product.variants)
            : [];
        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description || undefined,
            price: product.price,
            originalPrice: product.originalPrice,
            imageUrl,
            variants,
            category: {
                id: product.category.id,
                name: product.category.name,
            },
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}
exports.ProductService = ProductService;
