import { Request, Response } from 'express'
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.usecase'
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.usecase'
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.usecase'
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.usecase'
import { UpdateUserSchema } from '../../application/dto'

interface AuthenticatedRequest extends Request {
    user?: {
        id: string
        email: string
    }
}

export class UserController {
    constructor(
        private getUserProfileUseCase: GetUserProfileUseCase,
        private updateUserProfileUseCase: UpdateUserProfileUseCase,
        private getAllUsersUseCase: GetAllUsersUseCase,
        private deleteUserUseCase: DeleteUserUseCase
    ) {}

    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id
            if (!userId) {
                return res
                    .status(401)
                    .json({ error: 'Authentication required' })
            }

            const user = await this.getUserProfileUseCase.execute(userId)
            res.json({
                success: true,
                data: user,
            })
        } catch (err: any) {
            res.status(404).json({ error: err.message })
        }
    }

    async updateProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id
            if (!userId) {
                return res
                    .status(401)
                    .json({ error: 'Authentication required' })
            }

            const parsed = UpdateUserSchema.safeParse(req.body)
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.errors })
            }

            const user = await this.updateUserProfileUseCase.execute(
                userId,
                parsed.data
            )
            res.json({
                success: true,
                data: user,
            })
        } catch (err: any) {
            res.status(400).json({ error: err.message })
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const { page = '1', limit = '10', search } = req.query
            const skip =
                (parseInt(page as string) - 1) * parseInt(limit as string)
            const take = parseInt(limit as string)

            const users = await this.getAllUsersUseCase.execute({
                skip,
                take,
                search: search as string,
            })

            res.json({
                success: true,
                data: users,
            })
        } catch (err: any) {
            res.status(500).json({ error: err.message })
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params
            await this.deleteUserUseCase.execute(id)
            res.json({
                success: true,
                message: 'User deleted successfully',
            })
        } catch (err: any) {
            res.status(400).json({ error: err.message })
        }
    }
}
