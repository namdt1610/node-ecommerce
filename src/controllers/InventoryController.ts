import { NextFunction, Request, Response } from 'express'
import { InventoryService } from '@/services/InventoryService'

class InventoryController {
    private inventoryService: InventoryService

    constructor() {
        this.inventoryService = new InventoryService()
        this.getAllInventory = this.getAllInventory.bind(this)
        this.getInventoryByProductId = this.getInventoryByProductId.bind(this)
        this.getProductsInInventory = this.getProductsInInventory.bind(this)
        this.createInventory = this.createInventory.bind(this)
        this.updateInventory = this.updateInventory.bind(this)
        this.deleteInventory = this.deleteInventory.bind(this)
        this.addStock = this.addStock.bind(this)
        this.removeStock = this.removeStock.bind(this)
        this.getActivities = this.getActivities.bind(this)
    }

    async getAllInventory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const inventory = await this.inventoryService.listItems()
            res.status(200).json(inventory)
        } catch (error) {
            next(error)
        }
    }

    async getInventoryByProductId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId } = req.params
            const inventory = await this.inventoryService.getItem(productId)
            res.status(200).json(inventory)
        } catch (error) {
            next(error)
        }
    }

    async getProductsInInventory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const products = await this.inventoryService.listItems()
            if (Array.isArray(products)) {
                res.status(200).json(products.map((item) => item.product))
            } else {
                res.status(200).json([])
            }
        } catch (error) {
            next(error)
        }
    }

    async createInventory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await this.inventoryService.addItem(req.body)
            res.status(201).json({
                success: true,
                message: 'Create inventory successfully',
                inventory: result.item,
            })
        } catch (error) {
            next(error)
        }
    }

    async updateInventory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params
            const result = await this.inventoryService.updateItem(id, req.body)
            res.status(200).json({
                success: true,
                message: 'Inventory updated successfully',
                inventory: result.item,
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteInventory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId } = req.params
            await this.inventoryService.deleteItem(productId)
            res.status(200).json({
                success: true,
                message: 'Inventory deleted successfully',
            })
        } catch (error) {
            next(error)
        }
    }

    async addStock(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId } = req.params
            const { quantity } = req.body
            const result = await this.inventoryService.updateStock(
                productId,
                quantity,
                'add'
            )
            res.status(200).json({
                success: true,
                message: 'Stock added',
                inventory: result.item,
            })
        } catch (error) {
            next(error)
        }
    }

    async removeStock(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId } = req.params
            const { quantity } = req.body
            const result = await this.inventoryService.updateStock(
                productId,
                quantity,
                'remove'
            )
            res.status(200).json({
                success: true,
                message: 'Stock removed',
                inventory: result.item,
            })
        } catch (error) {
            next(error)
        }
    }

    async getActivities(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // This method would need a corresponding service method
            // You might need to add getInventoryActivities() to your service
            const activities =
                await this.inventoryService.getInventoryActivities()
            res.status(200).json({
                success: true,
                message: 'Fetched activities successfully',
                activities,
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new InventoryController()
