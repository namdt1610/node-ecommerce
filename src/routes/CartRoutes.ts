import express from 'express'
import * as c from '../controllers/CartController'

const router = express.Router()

router.post('/:userId', c.addToCart)
router.get('/:userId', c.getCart)
router.put('/:userId/:productId', c.updateCartItem)
router.delete('/:userId/:productId', c.removeFromCart)

export default router

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management APIs
 */

/**
 * @swagger
 * /api/cart/{userId}:
 *   get:
 *     summary: Get the cart of a specific user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart you want to retrieve
 *     responses:
 *       '200':
 *         description: A successful response with the user's cart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *       '404':
 *         description: Cart not found for the user
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart/{userId}:
 *   post:
 *     summary: Add a product to the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to whom the product will be added
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Product successfully added to the cart
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart/{userId}/{productId}:
 *   put:
 *     summary: Update a specific product's quantity in the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart is being updated
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product whose quantity is being updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Product quantity successfully updated in the cart
 *       '400':
 *         description: Invalid input or product not found in the cart
 *       '404':
 *         description: Cart or product not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart/{userId}/{productId}:
 *   delete:
 *     summary: Remove a specific product from the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart is being modified
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product being removed from the cart
 *     responses:
 *       '200':
 *         description: Product successfully removed from the cart
 *       '404':
 *         description: Cart or product not found
 *       '500':
 *         description: Server error
 */
