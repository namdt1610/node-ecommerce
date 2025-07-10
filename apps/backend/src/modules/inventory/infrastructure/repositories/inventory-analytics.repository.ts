import { PrismaClient } from '@prisma/client'
import { Inventory } from '../../domain/entities/inventory.entity'

export class InventoryAnalyticsRepository {
    constructor(private prisma: PrismaClient) {}

    async getStockValue(warehouseId?: string): Promise<number> {
        const where: any = { isActive: true }
        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        // Calculate total value = totalQuantity * averageCost for each inventory
        const inventories = await this.prisma.inventory.findMany({
            where,
            select: {
                totalQuantity: true,
                averageCost: true,
            },
        })

        return inventories.reduce((total, inventory) => {
            return total + inventory.totalQuantity * inventory.averageCost
        }, 0)
    }

    async getTotalItems(warehouseId?: string): Promise<number> {
        const where: any = { isActive: true }
        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        return this.prisma.inventory.count({ where })
    }

    async getTotalQuantity(warehouseId?: string): Promise<number> {
        const where: any = { isActive: true }
        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        const result = await this.prisma.inventory.aggregate({
            where,
            _sum: {
                totalQuantity: true,
            },
        })

        return result._sum.totalQuantity || 0
    }

    async getLowStockCount(warehouseId?: string): Promise<number> {
        const where: any = {
            isActive: true,
            // availableQuantity <= lowStockThreshold
            // Note: This would need raw SQL or computed field in production
        }

        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        // Simplified - would need proper low stock comparison
        const inventories = await this.prisma.inventory.findMany({
            where,
            select: {
                availableQuantity: true,
                lowStockThreshold: true,
            },
        })

        return inventories.filter(
            (inv) => inv.availableQuantity <= inv.lowStockThreshold
        ).length
    }

    async getOutOfStockCount(warehouseId?: string): Promise<number> {
        const where: any = {
            isActive: true,
            availableQuantity: 0,
        }

        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        return this.prisma.inventory.count({ where })
    }

    async getExpiredItemsCount(warehouseId?: string): Promise<number> {
        const where: any = {
            isActive: true,
            expiryDate: {
                lt: new Date(),
            },
        }

        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        return this.prisma.inventory.count({ where })
    }

    async getExpiringItemsCount(
        days: number = 30,
        warehouseId?: string
    ): Promise<number> {
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + days)

        const where: any = {
            isActive: true,
            expiryDate: {
                gte: new Date(),
                lte: futureDate,
            },
        }

        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        return this.prisma.inventory.count({ where })
    }

    async getTopProductsByValue(
        limit: number = 10,
        warehouseId?: string
    ): Promise<
        {
            productId: string
            sku: string
            totalQuantity: number
            unitCost: number
            totalValue: number
        }[]
    > {
        const where: any = { isActive: true }
        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        const inventories = await this.prisma.inventory.findMany({
            where,
            select: {
                productId: true,
                sku: true,
                totalQuantity: true,
                unitCost: true,
                averageCost: true,
            },
            take: limit * 2, // Get more to sort by calculated value
        })

        return inventories
            .map((inv) => ({
                productId: inv.productId,
                sku: inv.sku,
                totalQuantity: inv.totalQuantity,
                unitCost: inv.unitCost,
                totalValue: inv.totalQuantity * inv.averageCost,
            }))
            .sort((a, b) => b.totalValue - a.totalValue)
            .slice(0, limit)
    }

    async getWarehouseStats(warehouseId: string): Promise<{
        totalItems: number
        totalValue: number
        totalQuantity: number
        lowStockItems: number
        outOfStockItems: number
        expiredItems: number
        expiringItems: number
    }> {
        const [
            totalItems,
            totalValue,
            totalQuantity,
            lowStockItems,
            outOfStockItems,
            expiredItems,
            expiringItems,
        ] = await Promise.all([
            this.getTotalItems(warehouseId),
            this.getStockValue(warehouseId),
            this.getTotalQuantity(warehouseId),
            this.getLowStockCount(warehouseId),
            this.getOutOfStockCount(warehouseId),
            this.getExpiredItemsCount(warehouseId),
            this.getExpiringItemsCount(30, warehouseId),
        ])

        return {
            totalItems,
            totalValue,
            totalQuantity,
            lowStockItems,
            outOfStockItems,
            expiredItems,
            expiringItems,
        }
    }
}
