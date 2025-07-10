"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMovementRepository = void 0;
class InventoryMovementRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(movement) {
        const result = await this.prisma.inventoryMovement.create({
            data: {
                ...movement,
                createdAt: new Date(),
            },
        });
        return result;
    }
    async findByInventoryId(inventoryId, options) {
        const where = { inventoryId };
        if (options?.type) {
            where.type = options.type;
        }
        if (options?.dateFrom || options?.dateTo) {
            where.createdAt = {};
            if (options.dateFrom) {
                where.createdAt.gte = options.dateFrom;
            }
            if (options.dateTo) {
                where.createdAt.lte = options.dateTo;
            }
        }
        const [movements, total] = await Promise.all([
            this.prisma.inventoryMovement.findMany({
                where,
                skip: options?.skip,
                take: options?.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.inventoryMovement.count({ where }),
        ]);
        return {
            movements: movements,
            total,
        };
    }
    async getMovementsSummary(dateFrom, dateTo, warehouseId) {
        const where = {
            createdAt: {
                gte: dateFrom,
                lte: dateTo,
            },
        };
        if (warehouseId) {
            where.inventory = {
                warehouseId,
            };
        }
        // Get all movements in date range
        const movements = await this.prisma.inventoryMovement.findMany({
            where,
            include: {
                inventory: true,
            },
        });
        let totalIn = 0;
        let totalOut = 0;
        let totalAdjustments = 0;
        let totalValue = 0;
        movements.forEach((movement) => {
            const value = movement.totalCost || 0;
            totalValue += value;
            switch (movement.type) {
                case 'STOCK_IN':
                case 'RETURN':
                    totalIn += movement.quantity;
                    break;
                case 'STOCK_OUT':
                case 'DAMAGE':
                    totalOut += movement.quantity;
                    break;
                case 'ADJUSTMENT':
                    totalAdjustments += movement.quantity;
                    break;
            }
        });
        return {
            totalIn,
            totalOut,
            totalAdjustments,
            totalValue,
        };
    }
    async findByType(type, options) {
        const where = { type };
        if (options?.dateFrom || options?.dateTo) {
            where.createdAt = {};
            if (options.dateFrom) {
                where.createdAt.gte = options.dateFrom;
            }
            if (options.dateTo) {
                where.createdAt.lte = options.dateTo;
            }
        }
        const [movements, total] = await Promise.all([
            this.prisma.inventoryMovement.findMany({
                where,
                skip: options?.skip,
                take: options?.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.inventoryMovement.count({ where }),
        ]);
        return {
            movements: movements,
            total,
        };
    }
}
exports.InventoryMovementRepository = InventoryMovementRepository;
