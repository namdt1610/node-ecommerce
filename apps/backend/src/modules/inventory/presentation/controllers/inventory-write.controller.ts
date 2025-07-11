import { Request, Response } from 'express'
import { CreateInventoryUseCase } from '../../application/use-cases/create-inventory.usecase'
import { UpdateInventoryUseCase } from '../../application/use-cases/update-inventory.usecase'
import { ReserveStockUseCase } from '../../application/use-cases/stock/reserve-stock.usecase'
import { ReleaseStockUseCase } from '../../application/use-cases/stock/release-stock.usecase'
import { InventoryMapper } from '../../application/mappers/inventory.mapper'
import {
    CreateInventorySchema,
    UpdateInventorySchema,
    ReserveStockSchema,
} from '../../application/dto/inventory.dto'
import { BaseController } from '@/core/base-controller'

export class InventoryWriteController extends BaseController {
    constructor(
        private createInventoryUseCase: CreateInventoryUseCase,
        private updateInventoryUseCase: UpdateInventoryUseCase,
        private reserveStockUseCase: ReserveStockUseCase,
        private releaseStockUseCase: ReleaseStockUseCase
    ) {
        super()
    }

    async createInventory(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = CreateInventorySchema.parse(req.body)

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
            }

            const inventory =
                await this.createInventoryUseCase.execute(inventoryData)

            res.status(201).json({
                success: true,
                data: InventoryMapper.toResponseDto(inventory),
                message: 'Inventory created successfully',
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create inventory',
            })
        }
    }

    async updateInventory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const validatedData = UpdateInventorySchema.parse(req.body)

            // Convert expiryDate string to Date if provided
            const updateData = {
                ...validatedData,
                expiryDate: validatedData.expiryDate
                    ? new Date(validatedData.expiryDate)
                    : undefined,
            }

            const inventory = await this.updateInventoryUseCase.execute(
                id,
                updateData
            )

            res.json({
                success: true,
                data: InventoryMapper.toResponseDto(inventory),
                message: 'Inventory updated successfully',
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to update inventory',
            })
        }
    }

    async reserveStock(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = ReserveStockSchema.parse(req.body)
            const userId = (req as any).user?.id // Assuming auth middleware
            const { productId } = req.body // Add productId from request body

            const result = await this.reserveStockUseCase.execute({
                productId: validatedData.productId,
                quantity: validatedData.quantity,
                referenceId: validatedData.referenceId,
                referenceType: validatedData.referenceType,
                reason: validatedData.reason,
                userId,
            })

            if (result.success) {
                res.json({
                    success: true,
                    message: result.message,
                    data: { inventoryId: result.inventoryId },
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                })
            }
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to reserve stock',
            })
        }
    }

    async releaseStock(req: Request, res: Response): Promise<void> {
        try {
            const { productId, quantity, referenceId, reason } = req.body
            const userId = (req as any).user?.id

            const result = await this.releaseStockUseCase.execute({
                productId,
                quantity,
                referenceId,
                reason,
                userId,
            })

            if (result.success) {
                res.json({
                    success: true,
                    message: result.message,
                    data: { inventoryId: result.inventoryId },
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                })
            }
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to release stock',
            })
        }
    }

    async deleteInventory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params

            // Note: This would need a DeleteInventoryUseCase
            // For now, just mark as inactive
            const inventory = await this.updateInventoryUseCase.execute(id, {
                isActive: false,
            })

            res.json({
                success: true,
                message: 'Inventory deactivated successfully',
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to delete inventory',
            })
        }
    }
}
