"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryReadController = void 0;
const inventory_mapper_1 = require("../../application/mappers/inventory.mapper");
const inventory_dto_1 = require("../../application/dto/inventory.dto");
class InventoryReadController {
    getInventoryByIdUseCase;
    getAllInventoriesUseCase;
    checkAvailabilityUseCase;
    constructor(getInventoryByIdUseCase, getAllInventoriesUseCase, checkAvailabilityUseCase) {
        this.getInventoryByIdUseCase = getInventoryByIdUseCase;
        this.getAllInventoriesUseCase = getAllInventoriesUseCase;
        this.checkAvailabilityUseCase = checkAvailabilityUseCase;
    }
    async getInventoryById(req, res) {
        try {
            const { id } = req.params;
            const inventory = await this.getInventoryByIdUseCase.execute(id);
            if (!inventory) {
                res.status(404).json({
                    success: false,
                    message: 'Inventory not found',
                });
                return;
            }
            res.json({
                success: true,
                data: inventory_mapper_1.InventoryMapper.toResponseDto(inventory),
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to get inventory',
            });
        }
    }
    async getAllInventories(req, res) {
        try {
            const queryParams = inventory_dto_1.InventoryQuerySchema.parse(req.query);
            const options = {
                skip: (queryParams.page - 1) * queryParams.limit,
                take: queryParams.limit,
                warehouseId: queryParams.warehouseId,
                lowStock: queryParams.lowStock,
                expired: queryParams.expired,
                search: queryParams.search,
            };
            const result = await this.getAllInventoriesUseCase.execute(options);
            res.json({
                success: true,
                data: inventory_mapper_1.InventoryMapper.toResponseDtoList(result.inventories),
                pagination: {
                    page: queryParams.page,
                    limit: queryParams.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / queryParams.limit),
                    hasMore: result.hasMore,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to get inventories',
            });
        }
    }
    async checkAvailability(req, res) {
        try {
            const { productId } = req.params;
            const { quantity } = req.query;
            if (!quantity || isNaN(Number(quantity))) {
                res.status(400).json({
                    success: false,
                    message: 'Valid quantity is required',
                });
                return;
            }
            const result = await this.checkAvailabilityUseCase.execute(productId, Number(quantity));
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to check availability',
            });
        }
    }
    async getInventoryStats(req, res) {
        try {
            const { warehouseId } = req.query;
            // Get all inventories for stats calculation
            const result = await this.getAllInventoriesUseCase.execute({
                warehouseId: warehouseId,
            });
            const inventories = result.inventories;
            const totalValue = inventory_mapper_1.InventoryMapper.calculateInventoryValue(inventories);
            const lowStockItems = inventory_mapper_1.InventoryMapper.filterLowStockItems(inventories);
            const outOfStockItems = inventory_mapper_1.InventoryMapper.filterOutOfStockItems(inventories);
            const expiredItems = inventory_mapper_1.InventoryMapper.filterExpiredItems(inventories);
            const expiringItems = inventory_mapper_1.InventoryMapper.filterExpiringItems(inventories, 30);
            const stats = inventory_mapper_1.InventoryMapper.toStatsResponseDto({
                totalItems: inventories.length,
                totalValue,
                lowStockItems: lowStockItems.length,
                outOfStockItems: outOfStockItems.length,
                expiredItems: expiredItems.length,
                expiringItems: expiringItems.length,
            });
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to get inventory stats',
            });
        }
    }
}
exports.InventoryReadController = InventoryReadController;
