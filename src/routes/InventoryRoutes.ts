import express from 'express'
import InventoryController from '@/controllers/InventoryController'
import verifyToken from '@/middlewares/verifyToken'
import { isAdmin } from '@/middlewares/isAdmin'

const router = express.Router()

// Activity route should come before dynamic routes
router.get('/activity', verifyToken, InventoryController.getActivities)

// Stock management routes
router.post('/:productId/add', verifyToken, InventoryController.addStock)
router.post('/:productId/remove', verifyToken, InventoryController.removeStock)

// Inventory management routes
router.post('/', verifyToken, isAdmin, InventoryController.createInventory)
router.get('/', verifyToken, InventoryController.getAllInventory)
router.get(
    '/:productId',
    verifyToken,
    InventoryController.getInventoryByProductId
)
router.put(
    '/:productId',
    verifyToken,
    isAdmin,
    InventoryController.updateInventory
)
router.delete(
    '/:productId',
    verifyToken,
    isAdmin,
    InventoryController.deleteInventory
)

export default router

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management and stock activities
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory
 *     tags: [Inventory]
 *     responses:
 *       '200':
 *         description: A successful response with all inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   quantity:
 *                     type: number
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/inventory/{productId}:
 *   get:
 *     summary: Get inventory by product ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       '200':
 *         description: A successful response with the inventory of the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 quantity:
 *                   type: number
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/inventory/{productId}:
 *   put:
 *     summary: Update inventory for a product
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Inventory successfully updated
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/inventory/{productId}:
 *   delete:
 *     summary: Delete inventory for a product
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete inventory
 *     responses:
 *       '200':
 *         description: Inventory successfully deleted
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/inventory/activity:
 *   get:
 *     summary: Get all inventory activities
 *     tags: [Inventory]
 *     responses:
 *       '200':
 *         description: A successful response with all inventory activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   activityId:
 *                     type: string
 *                   productId:
 *                     type: string
 *                   action:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/inventory/{productId}/add:
 *   post:
 *     summary: Add stock to a product's inventory
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to add stock to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Stock successfully added
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/inventory/{productId}/remove:
 *   post:
 *     summary: Remove stock from a product's inventory
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove stock from
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Stock successfully removed
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */
