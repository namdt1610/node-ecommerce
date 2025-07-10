"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryWriteController = void 0;
const inventory_mapper_1 = require("../../application/mappers/inventory.mapper");
const inventory_dto_1 = require("../../application/dto/inventory.dto");
class InventoryWriteController {
    createInventoryUseCase;
    updateInventoryUseCase;
    reserveStockUseCase;
    releaseStockUseCase;
    constructor(createInventoryUseCase, updateInventoryUseCase, reserveStockUseCase, releaseStockUseCase) {
        this.createInventoryUseCase = createInventoryUseCase;
        this.updateInventoryUseCase = updateInventoryUseCase;
        this.reserveStockUseCase = reserveStockUseCase;
        this.releaseStockUseCase = releaseStockUseCase;
    }
    async createInventory(req, res) {
        try {
            const validatedData = inventory_dto_1.CreateInventorySchema.parse(req.body);
            // Convert expiryDate string to Date if provided
            const inventoryData = {
                ...validatedData,
                productId: validatedData.productId,
                sku: validatedData.sku,
                totalQuantity: validatedData.totalQuantity,
                lowStockThreshold: validatedData.lowStockThreshold,
                reorderPoint: validatedData.reorderPoint,
                reorderQuantity: validatedData.reorderQuantity,
                unitCost: validatedData.unitCost,
                warehouseId: validatedData.warehouseId,
                allowBackorder: validatedData.allowBackorder,
                backorderLimit: validatedData.backorderLimit,
                location: validatedData.location,
                batch: validatedData.batch,
                expiryDate: validatedData.expiryDate
                    ? new Date(validatedData.expiryDate)
                    : undefined,
                notes: validatedData.notes,
            };
            const inventory = await this.createInventoryUseCase.execute(inventoryData);
            res.status(201).json({
                success: true,
                data: inventory_mapper_1.InventoryMapper.toResponseDto(inventory),
                message: 'Inventory created successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create inventory',
            });
        }
    }
    async updateInventory(req, res) {
        try {
            const { id } = req.params;
            const validatedData = inventory_dto_1.UpdateInventorySchema.parse(req.body);
            // Convert expiryDate string to Date if provided
            const updateData = {
                ...validatedData,
                expiryDate: validatedData.expiryDate
                    ? new Date(validatedData.expiryDate)
                    : undefined,
            };
            const inventory = await this.updateInventoryUseCase.execute(id, updateData);
            res.json({
                success: true,
                data: inventory_mapper_1.InventoryMapper.toResponseDto(inventory),
                message: 'Inventory updated successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to update inventory',
            });
        }
    }
    async reserveStock(req, res) {
        try {
            const validatedData = inventory_dto_1.ReserveStockSchema.parse(req.body);
            const userId = req.user?.id; // Assuming auth middleware
            const { productId } = req.body; // Add productId from request body
            const result = await this.reserveStockUseCase.execute({
                productId: validatedData.productId,
                quantity: validatedData.quantity,
                referenceId: validatedData.referenceId,
                referenceType: validatedData.referenceType,
                reason: validatedData.reason,
                userId,
            });
            if (result.success) {
                res.json({
                    success: true,
                    message: result.message,
                    data: { inventoryId: result.inventoryId },
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                });
            }
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to reserve stock',
            });
        }
    }
    async releaseStock(req, res) {
        try {
            const { productId, quantity, referenceId, reason } = req.body;
            const userId = req.user?.id;
            const result = await this.releaseStockUseCase.execute({
                productId,
                quantity,
                referenceId,
                reason,
                userId,
            });
            if (result.success) {
                res.json({
                    success: true,
                    message: result.message,
                    data: { inventoryId: result.inventoryId },
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                });
            }
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to release stock',
            });
        }
    }
    async deleteInventory(req, res) {
        try {
            const { id } = req.params;
            // Note: This would need a DeleteInventoryUseCase
            // For now, just mark as inactive
            const inventory = await this.updateInventoryUseCase.execute(id, {
                isActive: false,
            });
            res.json({
                success: true,
                message: 'Inventory deactivated successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to delete inventory',
            });
        }
    }
}
exports.InventoryWriteController = InventoryWriteController;
