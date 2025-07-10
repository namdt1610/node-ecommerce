"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryReadRepository = void 0;
class InventoryReadRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const result = await this.prisma.inventory.findUnique({
            where: { id },
        });
        return result;
    }
    async findByProductId(productId) {
        const result = await this.prisma.inventory.findFirst({
            where: { productId },
        });
        return result;
    }
    async findBySku(sku) {
        const result = await this.prisma.inventory.findFirst({
            where: { sku },
        });
        return result;
    }
    async findAll(options) {
        const where = { isActive: true };
        if (options?.warehouseId) {
            where.warehouseId = options.warehouseId;
        }
        if (options?.lowStock) {
            where.availableQuantity = {
                lte: this.prisma.inventory.fields.lowStockThreshold,
            };
        }
        if (options?.expired) {
            where.expiryDate = { lt: new Date() };
        }
        if (options?.search) {
            where.OR = [
                { sku: { contains: options.search, mode: 'insensitive' } },
                { location: { contains: options.search, mode: 'insensitive' } },
                { batch: { contains: options.search, mode: 'insensitive' } },
            ];
        }
        const [inventories, total] = await Promise.all([
            this.prisma.inventory.findMany({
                where,
                skip: options?.skip,
                take: options?.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.inventory.count({ where }),
        ]);
        return {
            inventories: inventories,
            total,
        };
    }
    async findByWarehouse(warehouseId) {
        const result = await this.prisma.inventory.findMany({
            where: {
                warehouseId,
                isActive: true,
            },
            orderBy: { sku: 'asc' },
        });
        return result;
    }
    async findLowStockItems(warehouseId) {
        const where = {
            isActive: true,
            availableQuantity: {
                lte: this.prisma.inventory.fields.lowStockThreshold,
            },
        };
        if (warehouseId) {
            where.warehouseId = warehouseId;
        }
        const result = await this.prisma.inventory.findMany({
            where,
            orderBy: { availableQuantity: 'asc' },
        });
        return result;
    }
    async findExpiredItems(warehouseId) {
        const where = {
            isActive: true,
            expiryDate: { lt: new Date() },
        };
        if (warehouseId) {
            where.warehouseId = warehouseId;
        }
        const result = await this.prisma.inventory.findMany({
            where,
            orderBy: { expiryDate: 'asc' },
        });
        return result;
    }
    async findExpiringItems(days, warehouseId) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        const where = {
            isActive: true,
            expiryDate: {
                gte: new Date(),
                lte: futureDate,
            },
        };
        if (warehouseId) {
            where.warehouseId = warehouseId;
        }
        const result = await this.prisma.inventory.findMany({
            where,
            orderBy: { expiryDate: 'asc' },
        });
        return result;
    }
    async getStockValue(warehouseId) {
        const where = { isActive: true };
        if (warehouseId) {
            where.warehouseId = warehouseId;
        }
        const result = await this.prisma.inventory.aggregate({
            where,
            _sum: {
            // This would need a computed field in actual implementation
            // totalQuantity * averageCost
            },
        });
        // Simplified calculation - would need proper implementation
        return 0;
    }
    async checkAvailability(productId, quantity) {
        const inventory = await this.findByProductId(productId);
        return inventory ? inventory.availableQuantity >= quantity : false;
    }
    async getAvailableQuantity(productId) {
        const inventory = await this.findByProductId(productId);
        return inventory ? inventory.availableQuantity : 0;
    }
    async isInStock(productId) {
        const inventory = await this.findByProductId(productId);
        return inventory ? inventory.availableQuantity > 0 : false;
    }
}
exports.InventoryReadRepository = InventoryReadRepository;
