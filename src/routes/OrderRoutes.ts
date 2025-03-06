import express from 'express'
import orderController from '@/controllers/OrderController'

const router = express.Router()

// Create new order
router.post('/', orderController.createOrder)

// Get all orders
router.get('/', orderController.getAllOrders)

// Get single order by ID
router.get('/:id', orderController.getOrderById)

// Get orders by user ID
router.get('/user/:id', orderController.getOrdersByUserId)

// Update order
router.put('/:id', orderController.updateOrder)

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus)

// Delete order
router.delete('/:id', orderController.deleteOrder)

export default router

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               totalPrice:
 *                 type: number
 *                 format: float
 *     responses:
 *       '201':
 *         description: Order successfully created
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   status:
 *                     type: string
 *                   totalPrice:
 *                     type: number
 *                     format: float
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 status:
 *                   type: string
 *                 totalPrice:
 *                   type: number
 *                   format: float
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/user/{id}:
 *   get:
 *     summary: Get orders by user ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   status:
 *                     type: string
 *                   totalPrice:
 *                     type: number
 *                     format: float
 *       '404':
 *         description: No orders found for the user
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               totalPrice:
 *                 type: number
 *                 format: float
 *     responses:
 *       '200':
 *         description: Order successfully updated
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Order status successfully updated
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       '200':
 *         description: Order successfully deleted
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Server error
 */
