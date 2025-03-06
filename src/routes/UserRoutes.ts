import express from 'express'
import * as uc from '../controllers/UserController'
import verifyToken from '@/middlewares/verifyToken'
import isAdmin from '@/middlewares/isAdmin'

const router = express.Router()

// User routes (yêu cầu xác thực)
router.get('/', uc.getAllUsers)
router.get('/:id', verifyToken, isAdmin, uc.getUserById)
// router.put('/:id', ac.verifyToken, ac.checkRole(['admin']), uc.updateUser)
// router.delete('/:id', ac.verifyToken, ac.checkRole(['admin']), uc.deleteUser)
// router.get('/favorites/:id', ac.verifyToken, uc.getFavoritesById)
// router.post('/favorites', ac.verifyToken, uc.addToFavorites)

export default router

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and favorites API
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: A successful response with a list of all users
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
 *                   email:
 *                     type: string
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       '200':
 *         description: A successful response with user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       '403':
 *         description: Unauthorized access, user must be admin or the user themselves
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User successfully updated
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       '200':
 *         description: User successfully deleted
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/favorites/{id}:
 *   get:
 *     summary: Get user favorites by user ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to get favorites
 *     responses:
 *       '200':
 *         description: A successful response with a list of favorite products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   productName:
 *                     type: string
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/favorites:
 *   post:
 *     summary: Add product to favorites
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Product successfully added to favorites
 *       '400':
 *         description: Product already in favorites
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Could not add to favorites
 */
