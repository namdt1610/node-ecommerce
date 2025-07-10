"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRepository = void 0;
const inventory_read_repository_1 = require("./inventory-read.repository");
const inventory_write_repository_1 = require("./inventory-write.repository");
const inventory_movement_repository_1 = require("./inventory-movement.repository");
const inventory_alert_repository_1 = require("./inventory-alert.repository");
const inventory_analytics_repository_1 = require("./inventory-analytics.repository");
const inventory_transfer_repository_1 = require("./inventory-transfer.repository");
class InventoryRepository {
    prisma;
    readRepository;
    writeRepository;
    movementRepository;
    alertRepository;
    analyticsRepository;
    transferRepository;
    constructor(prisma) {
        this.prisma = prisma;
        this.readRepository = new inventory_read_repository_1.InventoryReadRepository(prisma);
        this.writeRepository = new inventory_write_repository_1.InventoryWriteRepository(prisma);
        this.movementRepository = new inventory_movement_repository_1.InventoryMovementRepository(prisma);
        this.alertRepository = new inventory_alert_repository_1.InventoryAlertRepository(prisma);
        this.analyticsRepository = new inventory_analytics_repository_1.InventoryAnalyticsRepository(prisma);
        this.transferRepository = new inventory_transfer_repository_1.InventoryTransferRepository(prisma);
    }
    // Read operations - delegate to read repository
    async findById(id) {
        return this.readRepository.findById(id);
    }
    async findByProductId(productId) {
        return this.readRepository.findByProductId(productId);
    }
    async findBySku(sku) {
        return this.readRepository.findBySku(sku);
    }
    async findAll(options) {
        const result = await this.readRepository.findAll(options);
        return {
            ...result,
            hasMore: result.total > (options?.skip || 0) + result.inventories.length,
        };
    }
    async findByWarehouse(warehouseId) {
        return this.readRepository.findByWarehouse(warehouseId);
    }
    async findLowStockItems(warehouseId) {
        return this.readRepository.findLowStockItems(warehouseId);
    }
    async findExpiredItems(warehouseId) {
        return this.readRepository.findExpiredItems(warehouseId);
    }
    async findExpiringItems(days, warehouseId) {
        return this.readRepository.findExpiringItems(days, warehouseId);
    }
    async checkAvailability(productId, quantity) {
        return this.readRepository.checkAvailability(productId, quantity);
    }
    async getAvailableQuantity(productId) {
        return this.readRepository.getAvailableQuantity(productId);
    }
    async isInStock(productId) {
        return this.readRepository.isInStock(productId);
    }
    // Write operations - delegate to write repository
    async create(inventoryData) {
        return this.writeRepository.create(inventoryData);
    }
    async update(id, inventoryData) {
        return this.writeRepository.update(id, inventoryData);
    }
    async delete(id) {
        return this.writeRepository.delete(id);
    }
    async updateStock(id, movement) {
        // This is a complex operation that needs both read and write
        const inventory = await this.readRepository.findById(id);
        if (!inventory) {
            throw new Error('Inventory not found');
        }
        // Calculate new quantities based on movement type
        let newTotal = inventory.totalQuantity;
        let newAvailable = inventory.availableQuantity;
        let newReserved = inventory.reservedQuantity;
        switch (movement.type) {
            case 'STOCK_IN':
                newTotal += movement.quantity;
                newAvailable += movement.quantity;
                break;
            case 'STOCK_OUT':
                newTotal -= movement.quantity;
                newAvailable -= movement.quantity;
                break;
            case 'ADJUSTMENT':
                newTotal = movement.quantity;
                newAvailable = movement.quantity - newReserved;
                break;
            case 'RESERVATION':
                newAvailable -= movement.quantity;
                newReserved += movement.quantity;
                break;
            case 'RELEASE':
                newAvailable += movement.quantity;
                newReserved -= movement.quantity;
                break;
        }
        // Update quantities
        const updatedInventory = await this.writeRepository.updateQuantities(id, newTotal, newAvailable, newReserved);
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
            totalCost: (movement.unitCost || inventory.unitCost) * movement.quantity,
            userId: undefined, // Remove userId from movement creation
        });
        return updatedInventory;
    }
    async reserveStock(inventoryId, quantity) {
        return this.writeRepository.reserveStock(inventoryId, quantity);
    }
    // Movement operations - delegate to movement repository
    async getMovements(inventoryId, options) {
        return this.movementRepository.findByInventoryId(inventoryId, options);
    }
    async createMovement(movement) {
        return this.movementRepository.create(movement);
    }
    async getMovementHistory(inventoryId) {
        const result = await this.movementRepository.findByInventoryId(inventoryId);
        return result.movements;
    }
    async getMovementsSummary(dateFrom, dateTo, warehouseId) {
        return this.movementRepository.getMovementsSummary(dateFrom, dateTo, warehouseId);
    }
    // Alert operations - delegate to alert repository
    async getAlerts(options) {
        return this.alertRepository.find(options);
    }
    async createAlert(alert) {
        return this.alertRepository.create(alert);
    }
    async markAlertAsRead(alertId) {
        return this.alertRepository.markAsRead(alertId);
    }
    async markAlertResolved(alertId) {
        return this.alertRepository.markAsResolved(alertId);
    }
    async getLowStockAlerts() {
        return this.alertRepository.getLowStockAlerts();
    }
    async getExpiryAlerts() {
        return this.alertRepository.getExpiryAlerts();
    }
    // Additional required methods from interface
    async releaseReservedStock(inventoryId, quantity) {
        return this.writeRepository.releaseReservedStock(inventoryId, quantity);
    }
    async adjustStock(inventoryId, newQuantity, reason, userId) {
        return this.writeRepository.adjustStock(inventoryId, newQuantity, newQuantity);
    }
    async bulkUpdateStock(updates) {
        // Implement bulk update logic
        for (const update of updates) {
            await this.writeRepository.updateQuantities(update.inventoryId, update.quantity, update.quantity, 0);
        }
    }
    // Analytics operations - delegate to analytics repository
    async getLowStockItems(warehouseId) {
        return this.readRepository.findLowStockItems(warehouseId);
    }
    async getExpiredItems(warehouseId) {
        return this.readRepository.findExpiredItems(warehouseId);
    }
    async getExpiringItems(days, warehouseId) {
        return this.readRepository.findExpiringItems(days, warehouseId);
    }
    async getStockValue(warehouseId) {
        return this.analyticsRepository.getStockValue(warehouseId);
    }
    // Transfer operations - delegate to transfer repository
    async transferStock(fromInventoryId, toInventoryId, quantity, reason, userId) {
        return this.transferRepository.transferStock(fromInventoryId, toInventoryId, quantity, reason, userId);
    }
}
exports.InventoryRepository = InventoryRepository;
