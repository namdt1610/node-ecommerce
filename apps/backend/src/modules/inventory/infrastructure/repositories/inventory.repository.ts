import { PrismaClient } from '@prisma/client'
import { IInventoryRepository } from '../../domain/interfaces/inventory-repository.interface'
import { InventoryReadRepository } from './inventory-read.repository'
import { InventoryWriteRepository } from './inventory-write.repository'
import { InventoryMovementRepository } from './inventory-movement.repository'
import { InventoryAlertRepository } from './inventory-alert.repository'
import { InventoryAnalyticsRepository } from './inventory-analytics.repository'
import { InventoryTransferRepository } from './inventory-transfer.repository'
import {
    Inventory,
    InventoryMovement,
    InventoryAlert,
    CreateInventoryData,
    UpdateInventoryData,
    InventoryStockMovement,
    InventoryMovementType,
    InventoryAlertType,
} from '../../domain/entities/inventory.entity'

export class InventoryRepository implements IInventoryRepository {
    private readRepository: InventoryReadRepository
    private writeRepository: InventoryWriteRepository
    private movementRepository: InventoryMovementRepository
    private alertRepository: InventoryAlertRepository
    private analyticsRepository: InventoryAnalyticsRepository
    private transferRepository: InventoryTransferRepository

    constructor(private prisma: PrismaClient) {
        this.readRepository = new InventoryReadRepository(prisma)
        this.writeRepository = new InventoryWriteRepository(prisma)
        this.movementRepository = new InventoryMovementRepository(prisma)
        this.alertRepository = new InventoryAlertRepository(prisma)
        this.analyticsRepository = new InventoryAnalyticsRepository(prisma)
        this.transferRepository = new InventoryTransferRepository(prisma)
    }

    // Read operations - delegate to read repository
    async findById(id: string): Promise<Inventory | null> {
        return this.readRepository.findById(id)
    }

    async findByProductId(productId: string): Promise<Inventory | null> {
        return this.readRepository.findByProductId(productId)
    }

    async findBySku(sku: string): Promise<Inventory | null> {
        return this.readRepository.findBySku(sku)
    }

    async findAll(
        options?: any
    ): Promise<{ inventories: Inventory[]; total: number; hasMore: boolean }> {
        const result = await this.readRepository.findAll(options)
        return {
            ...result,
            hasMore:
                result.total > (options?.skip || 0) + result.inventories.length,
        }
    }

    async findByWarehouse(warehouseId: string): Promise<Inventory[]> {
        return this.readRepository.findByWarehouse(warehouseId)
    }

    async findLowStockItems(warehouseId?: string): Promise<Inventory[]> {
        return this.readRepository.findLowStockItems(warehouseId)
    }

    async findExpiredItems(warehouseId?: string): Promise<Inventory[]> {
        return this.readRepository.findExpiredItems(warehouseId)
    }

    async findExpiringItems(
        days: number,
        warehouseId?: string
    ): Promise<Inventory[]> {
        return this.readRepository.findExpiringItems(days, warehouseId)
    }

    async checkAvailability(
        productId: string,
        quantity: number
    ): Promise<boolean> {
        return this.readRepository.checkAvailability(productId, quantity)
    }

    async getAvailableQuantity(productId: string): Promise<number> {
        return this.readRepository.getAvailableQuantity(productId)
    }

    async isInStock(productId: string): Promise<boolean> {
        return this.readRepository.isInStock(productId)
    }

    // Write operations - delegate to write repository
    async create(inventoryData: CreateInventoryData): Promise<Inventory> {
        return this.writeRepository.create(inventoryData)
    }

    async update(
        id: string,
        inventoryData: UpdateInventoryData
    ): Promise<Inventory> {
        return this.writeRepository.update(id, inventoryData)
    }

    async delete(id: string): Promise<void> {
        return this.writeRepository.delete(id)
    }

    async updateStock(
        id: string,
        movement: InventoryStockMovement
    ): Promise<Inventory> {
        // This is a complex operation that needs both read and write
        const inventory = await this.readRepository.findById(id)
        if (!inventory) {
            throw new Error('Inventory not found')
        }

        // Calculate new quantities based on movement type
        let newTotal = inventory.totalQuantity
        let newAvailable = inventory.availableQuantity
        let newReserved = inventory.reservedQuantity

        switch (movement.type) {
            case 'STOCK_IN':
                newTotal += movement.quantity
                newAvailable += movement.quantity
                break
            case 'STOCK_OUT':
                newTotal -= movement.quantity
                newAvailable -= movement.quantity
                break
            case 'ADJUSTMENT':
                newTotal = movement.quantity
                newAvailable = movement.quantity - newReserved
                break
            case 'RESERVATION':
                newAvailable -= movement.quantity
                newReserved += movement.quantity
                break
            case 'RELEASE':
                newAvailable += movement.quantity
                newReserved -= movement.quantity
                break
        }

        // Update quantities
        const updatedInventory = await this.writeRepository.updateQuantities(
            id,
            newTotal,
            newAvailable,
            newReserved
        )

        // Create movement record
        await this.writeRepository.createMovement({
            inventoryId: id,
            type: movement.type,
            quantity: movement.quantity,
            referenceId: movement.referenceId,
            referenceType: movement.referenceType,
            reason: movement.reason,
            notes: movement.notes,
            unitCost: movement.unitCost || inventory.unitCost,
            totalCost:
                (movement.unitCost || inventory.unitCost) * movement.quantity,
            userId: undefined, // Remove userId from movement creation
        })

        return updatedInventory
    }

    async reserveStock(
        inventoryId: string,
        quantity: number
    ): Promise<boolean> {
        return this.writeRepository.reserveStock(inventoryId, quantity)
    }

    // Movement operations - delegate to movement repository
    async getMovements(
        inventoryId: string,
        options?: {
            skip?: number
            take?: number
            type?: InventoryMovementType
            dateFrom?: Date
            dateTo?: Date
        }
    ): Promise<{ movements: InventoryMovement[]; total: number }> {
        return this.movementRepository.findByInventoryId(inventoryId, options)
    }

    async createMovement(
        movement: Omit<InventoryMovement, 'id' | 'createdAt'>
    ): Promise<InventoryMovement> {
        return this.movementRepository.create(movement)
    }

    async getMovementHistory(
        inventoryId: string
    ): Promise<InventoryMovement[]> {
        const result =
            await this.movementRepository.findByInventoryId(inventoryId)
        return result.movements
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
        return this.movementRepository.getMovementsSummary(
            dateFrom,
            dateTo,
            warehouseId
        )
    }

    // Alert operations - delegate to alert repository
    async getAlerts(options?: {
        skip?: number
        take?: number
        type?: InventoryAlertType
        resolved?: boolean
        inventoryId?: string
    }): Promise<{ alerts: InventoryAlert[]; total: number }> {
        return this.alertRepository.find(options)
    }

    async createAlert(
        alert: Omit<InventoryAlert, 'id' | 'createdAt'>
    ): Promise<InventoryAlert> {
        return this.alertRepository.create(alert)
    }

    async markAlertAsRead(alertId: string): Promise<void> {
        return this.alertRepository.markAsRead(alertId)
    }

    async markAlertResolved(alertId: string): Promise<void> {
        return this.alertRepository.markAsResolved(alertId)
    }

    async getLowStockAlerts(): Promise<InventoryAlert[]> {
        return this.alertRepository.getLowStockAlerts()
    }

    async getExpiryAlerts(): Promise<InventoryAlert[]> {
        return this.alertRepository.getExpiryAlerts()
    }

    // Additional required methods from interface
    async releaseReservedStock(
        inventoryId: string,
        quantity: number
    ): Promise<void> {
        return this.writeRepository.releaseReservedStock(inventoryId, quantity)
    }

    async adjustStock(
        inventoryId: string,
        newQuantity: number,
        reason: string,
        userId?: string
    ): Promise<Inventory> {
        return this.writeRepository.adjustStock(
            inventoryId,
            newQuantity,
            newQuantity
        )
    }

    async bulkUpdateStock(
        updates: {
            inventoryId: string
            quantity: number
            type: InventoryMovementType
            reason: string
        }[]
    ): Promise<void> {
        // Implement bulk update logic
        for (const update of updates) {
            await this.writeRepository.updateQuantities(
                update.inventoryId,
                update.quantity,
                update.quantity,
                0
            )
        }
    }

    // Analytics operations - delegate to analytics repository
    async getLowStockItems(warehouseId?: string): Promise<Inventory[]> {
        return this.readRepository.findLowStockItems(warehouseId)
    }

    async getExpiredItems(warehouseId?: string): Promise<Inventory[]> {
        return this.readRepository.findExpiredItems(warehouseId)
    }

    async getExpiringItems(
        days: number,
        warehouseId?: string
    ): Promise<Inventory[]> {
        return this.readRepository.findExpiringItems(days, warehouseId)
    }

    async getStockValue(warehouseId?: string): Promise<number> {
        return this.analyticsRepository.getStockValue(warehouseId)
    }

    // Transfer operations - delegate to transfer repository
    async transferStock(
        fromInventoryId: string,
        toInventoryId: string,
        quantity: number,
        reason: string,
        userId?: string
    ): Promise<void> {
        return this.transferRepository.transferStock(
            fromInventoryId,
            toInventoryId,
            quantity,
            reason,
            userId
        )
    }
}
