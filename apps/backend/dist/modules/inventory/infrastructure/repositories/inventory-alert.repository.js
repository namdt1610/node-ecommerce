"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryAlertRepository = void 0;
const inventory_entity_1 = require("../../domain/entities/inventory.entity");
class InventoryAlertRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(alert) {
        const result = await this.prisma.inventoryAlert.create({
            data: {
                ...alert,
                createdAt: new Date(),
            },
        });
        return result;
    }
    async find(options) {
        const where = {};
        if (options?.type) {
            where.type = options.type;
        }
        if (options?.resolved !== undefined) {
            where.isResolved = options.resolved;
        }
        if (options?.inventoryId) {
            where.inventoryId = options.inventoryId;
        }
        const [alerts, total] = await Promise.all([
            this.prisma.inventoryAlert.findMany({
                where,
                skip: options?.skip,
                take: options?.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.inventoryAlert.count({ where }),
        ]);
        return {
            alerts: alerts,
            total,
        };
    }
    async markAsResolved(alertId) {
        await this.prisma.inventoryAlert.update({
            where: { id: alertId },
            data: {
                isResolved: true,
                resolvedAt: new Date(),
            },
        });
    }
    async markAsRead(alertId) {
        await this.prisma.inventoryAlert.update({
            where: { id: alertId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async findUnresolved() {
        const result = await this.prisma.inventoryAlert.findMany({
            where: { isResolved: false },
            orderBy: { createdAt: 'desc' },
        });
        return result;
    }
    async findByType(type) {
        const result = await this.prisma.inventoryAlert.findMany({
            where: { type },
            orderBy: { createdAt: 'desc' },
        });
        return result;
    }
    async findByInventoryId(inventoryId) {
        const result = await this.prisma.inventoryAlert.findMany({
            where: { inventoryId },
            orderBy: { createdAt: 'desc' },
        });
        return result;
    }
    async getLowStockAlerts() {
        return this.findByType(inventory_entity_1.InventoryAlertType.LOW_STOCK);
    }
    async getExpiryAlerts() {
        return this.findByType(inventory_entity_1.InventoryAlertType.NEAR_EXPIRY);
    }
    async deleteOldAlerts(olderThanDays = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
        const result = await this.prisma.inventoryAlert.deleteMany({
            where: {
                isResolved: true,
                resolvedAt: {
                    lt: cutoffDate,
                },
            },
        });
        return result.count;
    }
}
exports.InventoryAlertRepository = InventoryAlertRepository;
