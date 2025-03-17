import express from 'express'
import CartController from '@/controllers/CartController'

const router = express.Router()

router.post('/:userId', CartController.addToCart)
router.get('/:userId', CartController.getCart)
router.put('/:userId/:productId', CartController.updateCartItem)
router.delete('/:userId/:productId', CartController.removeFromCart)
router.delete('/:userId', CartController.clearCart)

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
 *       '404':
 *         description: Cart not found for the user
 *       '500':
 *         description: Server error
 */

// ...rest of the Swagger documentation remains the same
