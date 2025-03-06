import express from 'express'
import wc from '../controllers/WarehouseController'

const router = express.Router()

router.get('/', wc.getAllWarehouses)
router.get('/:warehouseId', wc.getWarehouseById)
router.post('/', wc.createWarehouse)
router.put('/:warehouseId', wc.updateWarehouse)
router.delete('/:warehouseId', wc.deleteWarehouse)

export default router

/**
 * @swagger
 * tags:
 *   name: Warehouses
 *   description: API for managing warehouses
 *
 * /api/warehouses:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouses]
 *     responses:
 *       '200':
 *         description: A list of warehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *   post:
 *     summary: Create a new warehouse
 *     tags: [Warehouses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Warehouse created successfully
 *       '400':
 *         description: Invalid request data
 *
 * /api/warehouses/{warehouseId}:
 *   get:
 *     summary: Get warehouse by ID
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the warehouse
 *     responses:
 *       '200':
 *         description: Warehouse details
 *       '404':
 *         description: Warehouse not found
 *
 *   put:
 *     summary: Update warehouse by ID
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the warehouse to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Warehouse updated successfully
 *       '400':
 *         description: Invalid request data
 *       '404':
 *         description: Warehouse not found
 *
 *   delete:
 *     summary: Delete warehouse by ID
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the warehouse to delete
 *     responses:
 *       '200':
 *         description: Warehouse deleted successfully
 *       '404':
 *         description: Warehouse not found
 */
