import { uowWrapper } from '@/utils/uowWrapper'
import bcrypt from 'bcryptjs'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\services\UserService.ts

export class UserService {
    async getUserById(userId: string) {
        return uowWrapper(async (uow) => {
            const user = await uow.userRepository.findById(userId)
            if (!user) throw new UserError('User not found', 404)

            return {
                id: user._id,
                email: user.email,
                role: user.role,
            }
        })
    }

    async updateUserProfile(userId: string, data: any) {
        return uowWrapper(async (uow) => {
            const user = await uow.userRepository.findById(userId)
            if (!user) throw new UserError('User not found', 404)

            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10)
            }

            await uow.userRepository.updateUser(userId, data)

            return {
                message: 'User profile updated successfully',
            }
        })
    }

    async deleteUser(userId: string) {
        return uowWrapper(async (uow) => {
            const user = await uow.userRepository.findById(userId)
            if (!user) throw new UserError('User not found', 404)

            await uow.userRepository.deleteUser(userId)

            return { message: 'User deleted successfully' }
        })
    }

    async getUserStats() {
        return uowWrapper(async (uow) => {
            const totalUsers = await uow.userRepository.countTotal()
            const activeUsers = await uow.userRepository.countActive()

            return {
                total: totalUsers,
                active: activeUsers,
                inactive: totalUsers - activeUsers,
            }
        })
    }
}

class UserError extends Error {
    statusCode: number

    constructor(message: string, statusCode = 400) {
        super(message)
        this.name = 'UserError'
        this.statusCode = statusCode

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserError)
        }
    }
}

export default new UserService()
