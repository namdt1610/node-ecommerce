import { Router } from 'express'
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateClickCount,
    updateProduct,
    getActiveProducts,
} from '../controllers/ProductController'
import { decodeToken } from '../middlewares/jwtDecode'
import { isAuthorized } from '../middlewares/isAuthenticated'

const router = Router()

router.get('/active', getActiveProducts)
router.get('/:id', getProductById)
router.patch('/:id/click', updateClickCount)

router.get('/', decodeToken, isAuthorized(['admin', 'user']), getAllProducts)
router.post('/', decodeToken, isAuthorized(['admin']), createProduct)
router.delete('/:id', decodeToken, isAuthorized(['admin']), deleteProduct)
router.patch('/:id', decodeToken, isAuthorized(['admin']), updateProduct)

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
