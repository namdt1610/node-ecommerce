import { Request, Response, NextFunction } from 'express'
import User from '@/models/UserModel'
import { IRole } from '@/models/RoleModel'

interface AuthRequest extends Request {
    user?: { id: string; role: IRole }
}

export const checkPermission = (resource: string, action: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            const user = await User.findById(req.user.id).populate<{
                role: IRole
            }>('role')

            if (!user) {
                return res.status(401).json({ message: 'User not found' })
            }

            const permissions = user.role.permissions

            if (
                permissions.includes(`${resource}:${action}`) ||
                permissions.includes(`${resource}:*`) ||
                permissions.includes('*')
            ) {
                return next()
            }

            return res
                .status(403)
                .json({ message: 'Forbidden: No permission allowed!' })
        } catch (error) {
            res.status(500).json({ message: 'Error checking permission!' })
        }
    }
}
