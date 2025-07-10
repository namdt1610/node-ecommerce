import { Request, Response } from 'express'
import { GetInventoryByIdUseCase } from '../../application/use-cases/get-inventory-by-id.usecase'
import { GetAllInventoriesUseCase } from '../../application/use-cases/get-all-inventories.usecase'
import { CheckAvailabilityUseCase } from '../../application/use-cases/check-availability.usecase'
import { InventoryMapper } from '../../application/mappers/inventory.mapper'
import { InventoryQuerySchema } from '../../application/dto/inventory.dto'

export class InventoryReadController {
    constructor(
        private getInventoryByIdUseCase: GetInventoryByIdUseCase,
        private getAllInventoriesUseCase: GetAllInventoriesUseCase,
        private checkAvailabilityUseCase: CheckAvailabilityUseCase
    ) {}

    async getInventoryById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params

            const inventory = await this.getInventoryByIdUseCase.execute(id)

            if (!inventory) {
                res.status(404).json({
                    success: false,
                    message: 'Inventory not found',
                })
                return
            }

            res.json({
                success: true,
                data: InventoryMapper.toResponseDto(inventory),
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to get inventory',
            })
        }
    }

    async getAllInventories(req: Request, res: Response): Promise<void> {
        try {
            const queryParams = InventoryQuerySchema.parse(req.query)

            const options = {
                skip: (queryParams.page - 1) * queryParams.limit,
                take: queryParams.limit,
                warehouseId: queryParams.warehouseId,
                lowStock: queryParams.lowStock,
                expired: queryParams.expired,
                search: queryParams.search,
            }

            const result = await this.getAllInventoriesUseCase.execute(options)

            res.json({
                success: true,
                data: InventoryMapper.toResponseDtoList(result.inventories),
                pagination: {
                    page: queryParams.page,
                    limit: queryParams.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / queryParams.limit),
                    hasMore: result.hasMore,
                },
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to get inventories',
            })
        }
    }

    async checkAvailability(req: Request, res: Response): Promise<void> {
        try {
            const { productId } = req.params
            const { quantity } = req.query

            if (!quantity || isNaN(Number(quantity))) {
                res.status(400).json({
                    success: false,
                    message: 'Valid quantity is required',
                })
                return
            }

            const result = await this.checkAvailabilityUseCase.execute(
                productId,
                Number(quantity)
            )

            res.json({
                success: true,
                data: result,
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to check availability',
            })
        }
    }

    async getInventoryStats(req: Request, res: Response): Promise<void> {
        try {
            const { warehouseId } = req.query

            // Get all inventories for stats calculation
            const result = await this.getAllInventoriesUseCase.execute({
                warehouseId: warehouseId as string,
            })

            const inventories = result.inventories
            const totalValue =
                InventoryMapper.calculateInventoryValue(inventories)
            const lowStockItems =
                InventoryMapper.filterLowStockItems(inventories)
            const outOfStockItems =
                InventoryMapper.filterOutOfStockItems(inventories)
            const expiredItems = InventoryMapper.filterExpiredItems(inventories)
            const expiringItems = InventoryMapper.filterExpiringItems(
                inventories,
                30
            )

            const stats = InventoryMapper.toStatsResponseDto({
                totalItems: inventories.length,
                totalValue,
                lowStockItems: lowStockItems.length,
                outOfStockItems: outOfStockItems.length,
                expiredItems: expiredItems.length,
                expiringItems: expiringItems.length,
            })

            res.json({
                success: true,
                data: stats,
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to get inventory stats',
            })
        }
    }
}
