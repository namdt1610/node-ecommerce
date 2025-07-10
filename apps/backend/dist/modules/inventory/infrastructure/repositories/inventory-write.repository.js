"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryWriteRepository = void 0;
class InventoryWriteRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(inventoryData) {
        const now = new Date();
        const availableQuantity = inventoryData.totalQuantity;
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
        });
        return result;
    }
    async update(id, inventoryData) {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                ...inventoryData,
                expiryDate: inventoryData.expiryDate
                    ? new Date(inventoryData.expiryDate)
                    : undefined,
                updatedAt: new Date(),
            },
        });
        return result;
    }
    async delete(id) {
        await this.prisma.inventory.delete({
            where: { id },
        });
    }
    async updateQuantities(id, totalQuantity, availableQuantity, reservedQuantity) {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                totalQuantity,
                availableQuantity,
                reservedQuantity,
                lastStockCheck: new Date(),
                updatedAt: new Date(),
            },
        });
        return result;
    }
    async updateCosts(id, unitCost, averageCost) {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                unitCost,
                averageCost,
                updatedAt: new Date(),
            },
        });
        return result;
    }
    async reserveStock(inventoryId, quantity) {
        try {
            await this.prisma.inventory.update({
                where: { id: inventoryId },
                data: {
                    availableQuantity: { decrement: quantity },
                    reservedQuantity: { increment: quantity },
                    updatedAt: new Date(),
                },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async releaseReservedStock(inventoryId, quantity) {
        await this.prisma.inventory.update({
            where: { id: inventoryId },
            data: {
                availableQuantity: { increment: quantity },
                reservedQuantity: { decrement: quantity },
                updatedAt: new Date(),
            },
        });
    }
    async adjustStock(inventoryId, newTotalQuantity, newAvailableQuantity) {
        const result = await this.prisma.inventory.update({
            where: { id: inventoryId },
            data: {
                totalQuantity: newTotalQuantity,
                availableQuantity: newAvailableQuantity,
                lastStockCheck: new Date(),
                updatedAt: new Date(),
            },
        });
        return result;
    }
    async markAsInactive(id) {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });
        return result;
    }
    async updateLocation(id, location) {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                location,
                updatedAt: new Date(),
            },
        });
        return result;
    }
    async updateExpiryDate(id, expiryDate) {
        const result = await this.prisma.inventory.update({
            where: { id },
            data: {
                expiryDate,
                updatedAt: new Date(),
            },
        });
        return result;
    }
    async createMovement(movement) {
        const result = await this.prisma.inventoryMovement.create({
            data: {
                ...movement,
                createdAt: new Date(),
            },
        });
        return result;
    }
}
exports.InventoryWriteRepository = InventoryWriteRepository;
