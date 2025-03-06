import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Inventory from '../models/InventoryModel'
import InventoryActivity from '../models/InventoryActivityModel'

class InventoryController {
    // Get stock status
    async getAllInventory(req: Request, res: Response): Promise<void> {
        try {
            const inventory = await Inventory.find()
                .populate('warehouse')
                .populate('product')

            res.status(200).json(inventory)
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch inventory',
                error: error.message,
            })
        }
    }

    // Get inventory status by product ID
    async getInventoryByProductId(req: Request, res: Response): Promise<void> {
        try {
            const { productId } = req.params

            const inventory = await Inventory.findOne({
                product: productId,
            }).populate('warehouse')

            if (!inventory) {
                res.status(404).json({
                    error: 'Inventory not found',
                })
                return
            }

            res.status(200).json(inventory)
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch inventory',
                error: error.message,
            })
        }
    }

    // Get product list in an warehouse
    async getProductsInInventory(req: Request, res: Response): Promise<void> {
        try {
            const inventory = await Inventory.find().populate('product')
            const products = inventory.map((item) => item.product)

            res.status(200).json(products)
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch products',
                error: error.message,
            })
        }
    }

    // Create new inventory
    async createInventory(req: Request, res: Response): Promise<void> {
        try {
            const inventory = await Inventory.create(req.body)

            res.status(201).json({
                success: true,
                message: 'Create inventory successfully',
                inventory,
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: 'Failed to create inventory',
                error: error.message,
            })
        }
    }

    // Update inventory
    async updateInventory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const updates = req.body

            // Auto-update status based on quantity
            if (updates.quantity !== undefined) {
                updates.status =
                    updates.quantity < 1 ? 'out-of-stock' : 'in-stock'
            }

            const inventory = await Inventory.findByIdAndUpdate(id, updates, {
                new: true,
            }).populate('product')

            if (!inventory) {
                res.status(404).json({
                    success: false,
                    error: 'Inventory not found',
                })
                return
            }

            res.status(200).json({
                success: true,
                message: 'Inventory updated successfully',
                inventory,
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to update inventory',
                error: error.message,
            })
        }
    }

    // Delete inventory
    async deleteInventory(req: Request, res: Response): Promise<void> {
        try {
            const { productId } = req.params
            const inventory = await Inventory.findOneAndDelete({
                product: productId,
            })
            if (!inventory) {
                res.status(404).json({ error: 'Inventory not found' })
                return
            }

            res.status(200).json({
                success: true,
                message: 'Inventory deleted successfully',
            })
        } catch (error: any) {
            res.status(500).json({
                success: true,
                message: 'Failed to delete inventory',
                error: error.message,
            })
        }
    }

    // Add stock
    async addStock(req: Request, res: Response) {
        try {
            const { productId } = req.params
            const { quantity, userId, warehouseId } = req.body

            if (!productId || !quantity || quantity < 0) {
                res.status(400).json({ error: 'Invalid input data' })
                return
            }

            let inventory = await Inventory.findOne({ product: productId })
            const previousQuantity = inventory?.quantity || 0

            if (!inventory) {
                inventory = new Inventory({
                    product: productId,
                    quantity: quantity,
                    warehouse: warehouseId,
                })
            }

            inventory.quantity += quantity
            await inventory.save()

            // Log the activity
            await InventoryActivity.create({
                product: productId,
                action: 'add',
                quantity,
                previousQuantity,
                newQuantity: inventory.quantity,
                updatedBy: userId,
            })

            res.status(200).json({
                success: true,
                message: 'Stock added',
                inventory,
            })
        } catch (error: any) {
            console.error('Add stock error:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to add stock',
                error: error.message,
            })
        }
    }

    // Remove stock
    async removeStock(req: Request, res: Response): Promise<void> {
        try {
            const { productId } = req.params
            const { quantity } = req.body
            const userId = req.body.userId

            const inventory = await Inventory.findOne({ product: productId })
            if (!inventory) {
                res.status(404).json({ error: 'Inventory not found' })
                return
            }

            if (inventory.quantity < quantity) {
                res.status(400).json({ error: 'Insufficient stock' })
                return
            }

            const previousQuantity = inventory.quantity
            inventory.quantity -= quantity
            await inventory.save()

            await InventoryActivity.create({
                product: productId,
                action: 'remove',
                quantity,
                previousQuantity,
                newQuantity: inventory.quantity,
                updatedBy: userId,
            })

            res.status(200).json({
                success: true,
                message: 'Stock removed',
                inventory,
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to remove stock',
                error: error.message,
            })
        }
    }

    // Add activity query method
    async getActivities(req: Request, res: Response) {
        try {
            const activities = await mongoose
                .model('InventoryActivity')
                .find()
                .populate({
                    path: 'product',
                    select: 'name sku',
                })
                .sort({ createdAt: -1 })

            res.status(200).json({
                success: true,
                message: 'Fetched activities successfully',
                activities,
            })
        } catch (error: any) {
            console.error('Get activities error:', error.stack)
            res.status(500).json({
                success: false,
                message: 'Failed to fetch activities',
                error: error.message,
            })
        }
    }
}

export default new InventoryController()
