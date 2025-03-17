import { NextFunction, Request, Response } from 'express'
import { uowWrapper } from '@/utils/uowWrapper'

class UserController {
    constructor() {
        this.getUser = this.getUser.bind(this)
        this.getAllUsers = this.getAllUsers.bind(this)
        this.createUser = this.createUser.bind(this)
        this.updateUser = this.updateUser.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.getUserStats = this.getUserStats.bind(this)
    }

    async getUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.id
            const user = await uowWrapper(async (uow) => {
                return uow.userRepository.findById(userId)
            })

            if (!user) {
                res.status(404).json({ message: 'User not found' })
                return
            }

            res.json(user)
        } catch (error) {
            next(error)
        }
    }

    async getAllUsers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // Implementation would need findAll method in UserRepository
            const users = await uowWrapper(async (uow) => {
                // Placeholder for actual implementation
                return []
            })

            res.json(users)
        } catch (error) {
            next(error)
        }
    }

    async createUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, password, role } = req.body

            const newUser = await uowWrapper(async (uow) => {
                const existingUser = await uow.userRepository.findByEmail(email)
                if (existingUser) {
                    throw new Error('User with this email already exists')
                }

                return uow.userRepository.createUser(email, password, role)
            })

            res.status(201).json(newUser)
        } catch (error) {
            next(error)
        }
    }

    async updateUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.id
            const updateData = req.body

            const updatedUser = await uowWrapper(async (uow) => {
                const user = await uow.userRepository.findById(userId)
                if (!user) {
                    throw new Error('User not found')
                }

                return uow.userRepository.updateUser(userId, updateData)
            })

            res.json(updatedUser)
        } catch (error) {
            next(error)
        }
    }

    async deleteUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.id

            await uowWrapper(async (uow) => {
                const user = await uow.userRepository.findById(userId)
                if (!user) {
                    throw new Error('User not found')
                }

                await uow.userRepository.deleteUser(userId)
            })

            res.json({ message: 'User deleted successfully' })
        } catch (error) {
            next(error)
        }
    }

    async getUserStats(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const stats = await uowWrapper(async (uow) => {
                const total = await uow.userRepository.countTotal()
                const active = await uow.userRepository.countActive()

                return {
                    total,
                    active,
                    inactive: total - active,
                }
            })

            res.json(stats)
        } catch (error) {
            next(error)
        }
    }

    async getUserFavorites(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.id

            const favorites = await uowWrapper(async (uow) => {
                return uow.userRepository.getUserFavorites(userId)
            })

            if (!favorites) {
                res.status(404).json({ message: 'User not found' })
                return
            }

            res.json(favorites)
        } catch (error) {
            next(error)
        }
    }

    async addProductToFavorites(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { userId, productId } = req.body

            const updatedUser = await uowWrapper(async (uow) => {
                return uow.userRepository.addToFavorites(userId, productId)
            })

            res.json(updatedUser)
        } catch (error) {
            next(error)
        }
    }
}

export default new UserController()
