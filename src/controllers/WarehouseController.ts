import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Warehouse from '../models/WarehouseModel'

class WarehouseController {
    async getAllWarehouses(req: Request, res: Response): Promise<void> {
        try {
            const warehouses = await Warehouse.find()

            res.status(200).json(warehouses)
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch warehouses',
                error: error.message,
            })
        }
    }

    async getWarehouseById(req: Request, res: Response): Promise<void> {
        try {
            const { warehouseId } = req.params
            const warehouse = await Warehouse.findById(warehouseId)
            if (!warehouse) {
                res.status(404).json({ error: 'Warehouse not found' })
                return
            }

            res.status(200).json({ success: true, warehouse })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch warehouse',
                error: error.message,
            })
        }
    }

    async createWarehouse(req: Request, res: Response): Promise<void> {
        try {
            const warehouse = await Warehouse.create(req.body)

            res.status(201).json({
                success: true,
                message: 'Create warehouse successfully',
                warehouse,
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: 'Failed to create warehouse',
                error: error.message,
            })
        }
    }

    async updateWarehouse(req: Request, res: Response): Promise<void> {
        try {
            const { warehouseId } = req.params
            const warehouse = await Warehouse.findByIdAndUpdate(
                warehouseId,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            )
            if (!warehouse) {
                res.status(404).json({ error: 'Warehouse not found' })
                return
            }

            res.status(200).json({ success: true, warehouse })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to update warehouse',
                error: error.message,
            })
        }
    }

    async deleteWarehouse(req: Request, res: Response): Promise<void> {
        try {
            const { warehouseId } = req.params
            const warehouse = await Warehouse.findByIdAndDelete(warehouseId)
            if (!warehouse) {
                res.status(404).json({ error: 'Warehouse not found' })
                return
            }

            res.status(200).json({
                success: true,
                message: 'Delete warehouse successfully',
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete warehouse',
                error: error.message,
            })
        }
    }

    async deleteAllWarehouses(req: Request, res: Response): Promise<void> {
        try {
            await Warehouse.deleteMany({})
            res.status(200).json({
                success: true,
                message: 'Delete all warehouses successfully',
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete all warehouses',
                error: error.message,
            })
        }
    }
}

export default new WarehouseController()
