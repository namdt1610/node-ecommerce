import { Router } from 'express'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserRepository } from './user.repository'
import { authMiddleware } from '@/common/middlewares/auth.middleware'

const router = Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

// Profile routes (require authentication)
router.get(
    '/profile',
    authMiddleware,
    userController.getProfile.bind(userController)
)
router.put(
    '/profile',
    authMiddleware,
    userController.updateProfile.bind(userController)
)

// Standard CRUD routes
router.post('/', userController.createUser.bind(userController))
router.get('/', userController.getAllUsers.bind(userController))
router.get('/:id', userController.getUserById.bind(userController))
router.put('/:id', userController.updateUser.bind(userController))
router.delete('/:id', userController.deleteUser.bind(userController))

export default router
