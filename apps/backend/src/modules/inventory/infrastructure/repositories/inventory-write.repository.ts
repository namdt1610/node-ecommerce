import { PrismaClient } from '@prisma/client'
import {
    Inventory,
    CreateInventoryData,
    UpdateInventoryData,
    InventoryMovement,
} from '../../domain/entities/inventory.entity'

export class InventoryWriteRepository {
    constructor(private prisma: PrismaClient) {}

    async create(inventoryData: CreateInventoryData): Promise<Inventory> {
        const now = new Date()
        const availableQuantity = inventoryData.totalQuantity

        const result = await this.prisma.inventory.create({
            data: {
                productId: inventoryData.productId,
                warehouseId: inventoryData.warehouseId,
                sku: inventoryData.sku,
                totalQuantity: inventoryData.totalQuantity,
                availableQuantity,
                reservedQuantity: 0,
                lowStockThreshold: inventoryData.lowStockThreshold,
                allowBackorder: inventoryData.allowBackorder ?? false,
                backorderLimit: inventoryData.backorderLimit,
                reorderPoint: inventoryData.reorderPoint,
                reorderQuantity: inventoryData.reorderQuantity,
                unitCost: inventoryData.unitCost,
                averageCost: inventoryData.unitCost,
                location: inventoryData.location,
                batch: inventoryData.batch,
                expiryDate: inventoryData.expiryDate
                    ? new Date(inventoryData.expiryDate)
                    : null,
                isTracked: true,
                isActive: true,
                notes: inventoryData.notes,
                createdAt: now,
                updatedAt: now,
            },
        })
        return result as Inventory
    }

    async update(
        id: string,
        inventoryData: UpdateInventoryData
    ): Promise<Inventory> {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                ...inventoryData,
                expiryDate: inventoryData.expiryDate
                    ? new Date(inventoryData.expiryDate)
                    : undefined,
                updatedAt: new Date(),
            },
        })
        return result as Inventory
    }

    async delete(id: string): Promise<void> {
        await this.prisma.inventory.delete({
            where: { id },
        })
    }

    async updateQuantities(
        id: string,
        totalQuantity: number,
        availableQuantity: number,
        reservedQuantity: number
    ): Promise<Inventory> {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                totalQuantity,
                availableQuantity,
                reservedQuantity,
                lastStockCheck: new Date(),
                updatedAt: new Date(),
            },
        })
        return result as Inventory
    }

    async updateCosts(
        id: string,
        unitCost: number,
        averageCost: number
    ): Promise<Inventory> {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                unitCost,
                averageCost,
                updatedAt: new Date(),
            },
        })
        return result as Inventory
    }

    async reserveStock(
        inventoryId: string,
        quantity: number
    ): Promise<boolean> {
        try {
            await this.prisma.inventory.update({
                where: { id: inventoryId },
                data: {
                    availableQuantity: { decrement: quantity },
                    reservedQuantity: { increment: quantity },
                    updatedAt: new Date(),
                },
            })
            return true
        } catch (error) {
            return false
        }
    }

    async releaseReservedStock(
        inventoryId: string,
        quantity: number
    ): Promise<void> {
        await this.prisma.inventory.update({
            where: { id: inventoryId },
            data: {
                availableQuantity: { increment: quantity },
                reservedQuantity: { decrement: quantity },
                updatedAt: new Date(),
            },
        })
    }

    async adjustStock(
        inventoryId: string,
        newTotalQuantity: number,
        newAvailableQuantity: number
    ): Promise<Inventory> {
        const result = await this.prisma.inventory.update({
            where: { id: inventoryId },
            data: {
                totalQuantity: newTotalQuantity,
                availableQuantity: newAvailableQuantity,
                lastStockCheck: new Date(),
                updatedAt: new Date(),
            },
        })
        return result as Inventory
    }

    async markAsInactive(id: string): Promise<Inventory> {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        })
        return result as Inventory
    }

    async updateLocation(id: string, location: string): Promise<Inventory> {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                location,
                updatedAt: new Date(),
            },
        })
        return result as Inventory
    }

    async updateExpiryDate(
        id: string,
        expiryDate: Date | null
    ): Promise<Inventory> {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                expiryDate,
                updatedAt: new Date(),
            },
        })
        return result as Inventory
    }

    async createMovement(
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
}
