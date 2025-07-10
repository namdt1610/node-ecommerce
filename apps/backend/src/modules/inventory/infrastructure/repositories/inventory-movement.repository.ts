import { PrismaClient } from '@prisma/client'
import {
    InventoryMovement,
    InventoryMovementType,
} from '../../domain/entities/inventory.entity'

export class InventoryMovementRepository {
    constructor(private prisma: PrismaClient) {}

    async create(
        movement: Omit<InventoryMovement, 'id' | 'createdAt'>
    ): Promise<InventoryMovement> {
        const result = await this.prisma.inventoryMovement.create({
            data: {
                ...movement,
                createdAt: new Date(),
            },
        })
        return result as InventoryMovement
    }

    async findByInventoryId(
        inventoryId: string,
        options?: {
            skip?: number
            take?: number
            type?: InventoryMovementType
            dateFrom?: Date
            dateTo?: Date
        }
    ): Promise<{ movements: InventoryMovement[]; total: number }> {
        const where: any = { inventoryId }

        if (options?.type) {
            where.type = options.type
        }

        if (options?.dateFrom || options?.dateTo) {
            where.createdAt = {}
            if (options.dateFrom) {
                where.createdAt.gte = options.dateFrom
            }
            if (options.dateTo) {
                where.createdAt.lte = options.dateTo
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
        ])

        return {
            movements: movements as InventoryMovement[],
            total,
        }
    }

    async getMovementsSummary(
        dateFrom: Date,
        dateTo: Date,
        warehouseId?: string
    ): Promise<{
        totalIn: number
        totalOut: number
        totalAdjustments: number
        totalValue: number
    }> {
        const where: any = {
            createdAt: {
                gte: dateFrom,
                lte: dateTo,
            },
        }

        if (warehouseId) {
            where.inventory = {
                warehouseId,
            }
        }

        // Get all movements in date range
        const movements = await this.prisma.inventoryMovement.findMany({
            where,
            include: {
                inventory: true,
            },
        })

        let totalIn = 0
        let totalOut = 0
        let totalAdjustments = 0
        let totalValue = 0

        movements.forEach((movement) => {
            const value = movement.totalCost || 0
            totalValue += value

            switch (movement.type) {
                case 'STOCK_IN':
                case 'RETURN':
                    totalIn += movement.quantity
                    break
                case 'STOCK_OUT':
                case 'DAMAGE':
                    totalOut += movement.quantity
                    break
                case 'ADJUSTMENT':
                    totalAdjustments += movement.quantity
                    break
            }
        })

        return {
            totalIn,
            totalOut,
            totalAdjustments,
            totalValue,
        }
    }

    async findByType(
        type: InventoryMovementType,
        options?: {
            skip?: number
            take?: number
            dateFrom?: Date
            dateTo?: Date
        }
    ): Promise<{ movements: InventoryMovement[]; total: number }> {
        const where: any = { type }

        if (options?.dateFrom || options?.dateTo) {
            where.createdAt = {}
            if (options.dateFrom) {
                where.createdAt.gte = options.dateFrom
            }
            if (options.dateTo) {
                where.createdAt.lte = options.dateTo
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
        ])

        return {
            movements: movements as InventoryMovement[],
            total,
        }
    }
}
