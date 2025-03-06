import express from 'express'
import * as cc from '../controllers/CategoryController'

const router = express.Router()

// GET all categories
router.get('/', cc.getAllCategories)

// GET a Category by id
router.get('/:id', cc.getCategoryById)

// POST a Category
router.post('/', cc.createCategory)

// DELETE a Category by id
router.delete('/:id', cc.deleteCategory)

// UPDATE a Category by id
router.patch('/:id', cc.updateCategory)

export default router

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       '200':
 *         description: A successful response with all categories
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
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category
 *     responses:
 *       '200':
 *         description: A successful response with the category data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Category successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       '200':
 *         description: Category successfully deleted
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Update a category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Category successfully updated
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Server error
 */
