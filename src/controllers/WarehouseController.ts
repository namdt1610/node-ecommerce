import { NextFunction, Request, Response } from 'express'
import { WarehouseService } from '@/services/WarehouseService'

class WarehouseController {
    private warehouseService: WarehouseService

    constructor() {
        this.warehouseService = new WarehouseService()
        this.getAllWarehouses = this.getAllWarehouses.bind(this)
        this.getWarehouseById = this.getWarehouseById.bind(this)
        this.createWarehouse = this.createWarehouse.bind(this)
        this.updateWarehouse = this.updateWarehouse.bind(this)
        this.deleteWarehouse = this.deleteWarehouse.bind(this)
    }

    async getAllWarehouses(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const warehouses = await this.warehouseService.findAll()
            res.status(200).json(warehouses)
        } catch (error: any) {
            next(error)
        }
    }

    async getWarehouseById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { warehouseId } = req.params
            const warehouse = await this.warehouseService.findById(warehouseId)
            res.status(200).json({ success: true, warehouse })
        } catch (error: any) {
            next(error)
        }
    }

    async createWarehouse(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const warehouse = await this.warehouseService.create(req.body)
            res.status(201).json({
                success: true,
                message: 'Create warehouse successfully',
                warehouse,
            })
        } catch (error: any) {
            next(error)
        }
    }

    async updateWarehouse(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { warehouseId } = req.params
            const warehouse = await this.warehouseService.update(
                warehouseId,
                req.body
            )
            res.status(200).json({ success: true, warehouse })
        } catch (error: any) {
            next(error)
        }
    }

    async deleteWarehouse(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { warehouseId } = req.params
            await this.warehouseService.delete(warehouseId)
            res.status(200).json({
                success: true,
                message: 'Delete warehouse successfully',
            })
        } catch (error: any) {
            next(error)
        }
    }
}

export default new WarehouseController()
