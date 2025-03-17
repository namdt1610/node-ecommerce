import { Request, Response, NextFunction } from 'express'
import User from '@/models/UserModel'
import { IRole } from '@/models/RoleModel'

export const isAdmin = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // req.user is set by verifyToken middleware
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }

        const user = await User.findById(req.user.id).populate<{ role: IRole }>(
            'role'
        )

        if (!user || user.role.name !== 'admin') {
            res.status(403).json({
                message: 'Access denied. Admin role required.',
            })
            return
        }

        next()
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}
