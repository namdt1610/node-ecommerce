import express from 'express'
import ProductController from '@/controllers/ProductController'
import verifyToken from '@/middlewares/verifyToken'
import { isAdmin } from '@/middlewares/isAdmin'

const router = express.Router()

// Public routes
router.get('/active', ProductController.getActiveProducts)
router.get('/:id', ProductController.getProductById)
router.patch('/:id/click', ProductController.updateClickCount)

// Protected routes
router.get('/', verifyToken, ProductController.getAllProducts)
router.post('/', verifyToken, isAdmin, ProductController.createProduct)
router.delete('/:id', verifyToken, isAdmin, ProductController.deleteProduct)
router.patch('/:id', verifyToken, isAdmin, ProductController.updateProduct)

export default router

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       '200':
 *         description: A successful response with a list of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   clickCount:
 *                     type: number
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       '200':
 *         description: A successful response with product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 clickCount:
 *                   type: number
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Product successfully created
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       '200':
 *         description: Product successfully deleted
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Product successfully updated
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/{id}/click:
 *   patch:
 *     summary: Update the click count of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update click count
 *     responses:
 *       '200':
 *         description: Click count successfully updated
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */
