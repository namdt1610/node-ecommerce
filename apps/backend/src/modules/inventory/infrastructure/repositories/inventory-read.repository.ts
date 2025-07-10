import { PrismaClient } from '@prisma/client'
import {
    Inventory,
    InventoryMovement,
    InventoryAlert,
} from '../../domain/entities/inventory.entity'

export class InventoryReadRepository {
    constructor(private prisma: PrismaClient) {}

    async findById(id: string): Promise<Inventory | null> {
        const result = await this.prisma.inventory.findUnique({
            where: { id },
        })
        return result as Inventory | null
    }

    async findByProductId(productId: string): Promise<Inventory | null> {
        const result = await this.prisma.inventory.findFirst({
            where: { productId },
        })
        return result as Inventory | null
    }

    async findBySku(sku: string): Promise<Inventory | null> {
        const result = await this.prisma.inventory.findFirst({
            where: { sku },
        })
        return result as Inventory | null
    }

    async findAll(options?: {
        skip?: number
        take?: number
        warehouseId?: string
        lowStock?: boolean
        expired?: boolean
        search?: string
    }): Promise<{ inventories: Inventory[]; total: number }> {
        const where: any = { isActive: true }

        if (options?.warehouseId) {
            where.warehouseId = options.warehouseId
        }

        if (options?.lowStock) {
            where.availableQuantity = {
                lte: this.prisma.inventory.fields.lowStockThreshold,
            }
        }

        if (options?.expired) {
            where.expiryDate = { lt: new Date() }
        }

        if (options?.search) {
            where.OR = [
                { sku: { contains: options.search, mode: 'insensitive' } },
                { location: { contains: options.search, mode: 'insensitive' } },
                { batch: { contains: options.search, mode: 'insensitive' } },
            ]
        }

        const [inventories, total] = await Promise.all([
            this.prisma.inventory.findMany({
                where,
                skip: options?.skip,
                take: options?.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.inventory.count({ where }),
        ])

        return {
            inventories: inventories as Inventory[],
            total,
        }
    }

    async findByWarehouse(warehouseId: string): Promise<Inventory[]> {
        const result = await this.prisma.inventory.findMany({
            where: {
                warehouseId,
                isActive: true,
            },
            orderBy: { sku: 'asc' },
        })
        return result as Inventory[]
    }

    async findLowStockItems(warehouseId?: string): Promise<Inventory[]> {
        const where: any = {
            isActive: true,
            availableQuantity: {
                lte: this.prisma.inventory.fields.lowStockThreshold,
            },
        }

        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        const result = await this.prisma.inventory.findMany({
            where,
            orderBy: { availableQuantity: 'asc' },
        })
        return result as Inventory[]
    }

    async findExpiredItems(warehouseId?: string): Promise<Inventory[]> {
        const where: any = {
            isActive: true,
            expiryDate: { lt: new Date() },
        }

        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        const result = await this.prisma.inventory.findMany({
            where,
            orderBy: { expiryDate: 'asc' },
        })
        return result as Inventory[]
    }

    async findExpiringItems(
        days: number,
        warehouseId?: string
    ): Promise<Inventory[]> {
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

        const result = await this.prisma.inventory.findMany({
            where,
            orderBy: { expiryDate: 'asc' },
        })
        return result as Inventory[]
    }

    async getStockValue(warehouseId?: string): Promise<number> {
        const where: any = { isActive: true }
        if (warehouseId) {
            where.warehouseId = warehouseId
        }

        const result = await this.prisma.inventory.aggregate({
            where,
            _sum: {
                // This would need a computed field in actual implementation
                // totalQuantity * averageCost
            },
        })

        // Simplified calculation - would need proper implementation
        return 0
    }

    async checkAvailability(
        productId: string,
        quantity: number
    ): Promise<boolean> {
        const inventory = await this.findByProductId(productId)
        return inventory ? inventory.availableQuantity >= quantity : false
    }

    async getAvailableQuantity(productId: string): Promise<number> {
        const inventory = await this.findByProductId(productId)
        return inventory ? inventory.availableQuantity : 0
    }

    async isInStock(productId: string): Promise<boolean> {
        const inventory = await this.findByProductId(productId)
        return inventory ? inventory.availableQuantity > 0 : false
    }
}
