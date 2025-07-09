"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleProductRepository = void 0;
class SimpleProductRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(productData) {
        const product = await this.prisma.product.create({
            data: {
                name: productData.name,
                slug: productData.name.toLowerCase().replace(/\s+/g, '-'),
                description: productData.description,
                price: productData.price,
                categoryId: productData.categoryId,
            },
            include: {
                category: true,
            },
        });
        return this.mapToProduct(product);
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
        return product ? this.mapToProduct(product) : null;
    }
    async findAll(options) {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (options?.categoryId) {
            where.categoryId = options.categoryId;
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: true,
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products: products.map(this.mapToProduct),
            total,
            hasMore: skip + products.length < total,
        };
    }
    async update(id, updateData) {
        // Filter updateData to only include fields that Prisma can handle
        const { name, description, price, originalPrice, isActive, isFeatured, status, } = updateData;
        const prismaData = {};
        if (name !== undefined)
            prismaData.name = name;
        if (description !== undefined)
            prismaData.description = description;
        if (price !== undefined)
            prismaData.price = price;
        if (originalPrice !== undefined)
            prismaData.originalPrice = originalPrice;
        if (isActive !== undefined)
            prismaData.isActive = isActive;
        if (isFeatured !== undefined)
            prismaData.isFeatured = isFeatured;
        if (status !== undefined)
            prismaData.status = status;
        const product = await this.prisma.product.update({
            where: { id },
            data: prismaData,
            include: {
                category: true,
            },
        });
        return this.mapToProduct(product);
    }
    async delete(id) {
        await this.prisma.product.delete({
            where: { id },
        });
    }
    async search(options) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (options.query) {
            where.name = {
                contains: options.query,
                mode: 'insensitive',
            };
        }
        if (options.filters?.categoryId) {
            where.categoryId = options.filters.categoryId;
        }
        if (options.filters?.priceMin !== undefined ||
            options.filters?.priceMax !== undefined) {
            where.price = {};
            if (options.filters.priceMin !== undefined) {
                where.price.gte = options.filters.priceMin;
            }
            if (options.filters.priceMax !== undefined) {
                where.price.lte = options.filters.priceMax;
            }
        }
        let orderBy = { createdAt: 'desc' };
        if (options.sortBy === 'price') {
            orderBy = { price: options.sortOrder || 'asc' };
        }
        else if (options.sortBy === 'name') {
            orderBy = { name: options.sortOrder || 'asc' };
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: true,
                },
                skip,
                take: limit,
                orderBy,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products: products.map(this.mapToProduct),
            total,
            hasMore: skip + products.length < total,
        };
    }
    // Implement other required methods with simple implementations
    async findByCategory(categoryId, options) {
        return this.findAll({ ...options, categoryId });
    }
    async findByBrand(brand, options) {
        // Simple implementation - in real app you'd have brand field
        return this.findAll(options);
    }
    async findByFilters(filters, options) {
        const searchOptions = {
            page: 1,
            limit: 20,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            ...options,
            filters,
        };
        return this.search(searchOptions);
    }
    async findFeatured(options) {
        const { products } = await this.findAll({ ...options, limit: 8 });
        return products;
    }
    async findBestSellers(options) {
        const { products } = await this.findAll({ ...options, limit: 8 });
        return products;
    }
    async findRelated(productId, limit) {
        const product = await this.findById(productId);
        if (!product)
            return [];
        const { products } = await this.findAll({
            categoryId: product.categoryId,
            limit: limit || 4,
        });
        return products.filter((p) => p.id !== productId);
    }
    async updateStock(productId, quantity) {
        // Simple implementation - in real app you'd update inventory
        const product = await this.findById(productId);
        if (!product)
            throw new Error('Product not found');
        return product;
    }
    async reduceStock(productId, quantity) {
        return this.updateStock(productId, quantity);
    }
    async updateSEO(productId, seoData) {
        const product = await this.findById(productId);
        if (!product)
            throw new Error('Product not found');
        // In real implementation, update SEO data
    }
    async bulkUpdateStatus(productIds, status) {
        // Simple implementation
    }
    async isStockAvailable(productId, quantity) {
        return true; // Simple implementation
    }
    async isLowStock(productId) {
        return false; // Simple implementation
    }
    // Missing required methods implementation
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: { category: true },
        });
        return product ? this.mapToProduct(product) : null;
    }
    async findBySku(sku) {
        const product = await this.prisma.product.findUnique({
            where: { sku },
            include: { category: true },
        });
        return product ? this.mapToProduct(product) : null;
    }
    async findPopular(limit = 10) {
        const { products } = await this.findAll({ limit });
        return products;
    }
    async findRecentlyAdded(limit = 10) {
        const { products } = await this.findAll({ limit });
        return products;
    }
    async findOnSale(limit = 10) {
        const { products } = await this.findAll({ limit });
        return products;
    }
    async findRelatedProducts(productId, limit = 5) {
        return this.findRelated(productId, limit);
    }
    async findSimilarProducts(productId, limit = 5) {
        return this.findRelated(productId, limit);
    }
    async updateInventory(productId, quantity) {
        await this.updateStock(productId, quantity);
    }
    async reserveQuantity(productId, quantity) {
        return true; // Simple implementation
    }
    async releaseReservedQuantity(productId, quantity) {
        // Simple implementation
    }
    async findProductWithVariants(productId) {
        return this.findById(productId);
    }
    async updateVariantInventory(productId, variantId, quantity) {
        // Simple implementation
    }
    async createProductDetails(productId, details) {
        throw new Error('Not implemented');
    }
    async getProductDetails(productId) {
        return null;
    }
    async updateProductDetails(productId, details) {
        throw new Error('Not implemented');
    }
    async getProductAnalytics(productId) {
        return {
            views: 0,
            sales: 0,
            revenue: 0,
            averageRating: 0,
            reviewCount: 0,
        };
    }
    async bulkUpdatePrices(updates) {
        // Simple implementation
    }
    async checkAvailability(productId, quantity) {
        return this.isStockAvailable(productId, quantity);
    }
    async getAvailableQuantity(productId) {
        return 0; // Simple implementation
    }
    async generateSlug(name) {
        return name.toLowerCase().replace(/\s+/g, '-');
    }
    async getProductCategories() {
        return this.prisma.category.findMany();
    }
    async getProductAttributes(categoryId) {
        return [];
    }
    async getFilterableAttributes() {
        return [];
    }
    async findProductsWithMinimalData(options) {
        const result = await this.search(options);
        return {
            products: result.products,
            total: result.total,
        };
    }
    mapToProduct(product) {
        return {
            id: product.id,
            name: product.name,
            slug: product.slug || '',
            brand: product.brand || '',
            model: product.model || '',
            sku: product.sku || '',
            description: product.description || '',
            shortDescription: product.shortDescription,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            discount: product.discount,
            currency: product.currency || 'USD',
            categoryId: product.categoryId,
            category: product.category,
            subCategoryId: product.subCategoryId,
            subCategory: product.subCategory,
            productType: product.productType,
            condition: product.condition,
            status: product.status,
            images: product.images || [],
            videos: product.videos || [],
            attributes: product.attributes || [],
            specifications: product.specifications || [],
            variants: product.variants || [],
            inventory: product.inventory || {
                totalQuantity: 0,
                availableQuantity: 0,
                reservedQuantity: 0,
                lowStockThreshold: 0,
                trackQuantity: true,
                allowBackorder: false,
            },
            seo: product.seo || {},
            ratings: product.ratings || {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            },
            tags: product.tags || [],
            isActive: product.isActive ?? true,
            isFeatured: product.isFeatured ?? false,
            isDigital: product.isDigital ?? false,
            weight: product.weight,
            dimensions: product.dimensions,
            shippingInfo: product.shippingInfo,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}
exports.SimpleProductRepository = SimpleProductRepository;
