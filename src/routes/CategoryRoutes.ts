import express from 'express'
import CategoryController from '@/controllers/CategoryController'
import verifyToken from '@/middlewares/verifyToken'
import { isAdmin } from '@/middlewares/isAdmin'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\routes\CategoryRoutes.ts

const router = express.Router()

// Public routes
router.get('/', CategoryController.getAllCategories)
router.get('/:id', CategoryController.getCategoryById)

// Protected routes - require authentication and admin privileges
router.post('/', verifyToken, isAdmin, CategoryController.createCategory)
router.put('/:id', verifyToken, isAdmin, CategoryController.updateCategory)
router.delete('/:id', verifyToken, isAdmin, CategoryController.deleteCategory)

export default router