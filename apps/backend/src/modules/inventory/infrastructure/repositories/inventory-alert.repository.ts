import { PrismaClient } from '@prisma/client'
import {
    InventoryAlert,
    InventoryAlertType,
} from '../../domain/entities/inventory.entity'

export class InventoryAlertRepository {
    constructor(private prisma: PrismaClient) {}

    async create(
        alert: Omit<InventoryAlert, 'id' | 'createdAt'>
    ): Promise<InventoryAlert> {
        const result = await this.prisma.inventoryAlert.create({
            data: {
                ...alert,
                createdAt: new Date(),
            },
        })
        return result as InventoryAlert
    }

    async find(options?: {
        skip?: number
        take?: number
        type?: InventoryAlertType
        resolved?: boolean
        inventoryId?: string
    }): Promise<{ alerts: InventoryAlert[]; total: number }> {
        const where: any = {}

        if (options?.type) {
            where.type = options.type
        }

        if (options?.resolved !== undefined) {
            where.isResolved = options.resolved
        }

        if (options?.inventoryId) {
            where.inventoryId = options.inventoryId
        }

        const [alerts, total] = await Promise.all([
            this.prisma.inventoryAlert.findMany({
                where,
                skip: options?.skip,
                take: options?.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.inventoryAlert.count({ where }),
        ])

        return {
            alerts: alerts as InventoryAlert[],
            total,
        }
    }

    async markAsResolved(alertId: string): Promise<void> {
        await this.prisma.inventoryAlert.update({
            where: { id: alertId },
            data: {
                isResolved: true,
                resolvedAt: new Date(),
            },
        })
    }

    async markAsRead(alertId: string): Promise<void> {
        await this.prisma.inventoryAlert.update({
            where: { id: alertId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        })
    }

    async findUnresolved(): Promise<InventoryAlert[]> {
        const result = await this.prisma.inventoryAlert.findMany({
            where: { isResolved: false },
            orderBy: { createdAt: 'desc' },
        })
        return result as InventoryAlert[]
    }

    async findByType(type: InventoryAlertType): Promise<InventoryAlert[]> {
        const result = await this.prisma.inventoryAlert.findMany({
            where: { type },
            orderBy: { createdAt: 'desc' },
        })
        return result as InventoryAlert[]
    }

    async findByInventoryId(inventoryId: string): Promise<InventoryAlert[]> {
        const result = await this.prisma.inventoryAlert.findMany({
            where: { inventoryId },
            orderBy: { createdAt: 'desc' },
        })
        return result as InventoryAlert[]
    }

    async getLowStockAlerts(): Promise<InventoryAlert[]> {
        return this.findByType(InventoryAlertType.LOW_STOCK)
    }

    async getExpiryAlerts(): Promise<InventoryAlert[]> {
        return this.findByType(InventoryAlertType.NEAR_EXPIRY)
    }

    async deleteOldAlerts(olderThanDays: number = 30): Promise<number> {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

        const result = await this.prisma.inventoryAlert.deleteMany({
            where: {
                isResolved: true,
                resolvedAt: {
                    lt: cutoffDate,
                },
            },
        })

        return result.count
    }
}
