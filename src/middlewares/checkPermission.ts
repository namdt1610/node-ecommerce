import { Request, Response, NextFunction } from 'express'
import User from '@/models/UserModel'

interface AuthRequest extends Request {
    user?: { id: string; role: string }
}

// Middleware kiểm tra quyền truy cập
export const checkPermission = (resource: string, action: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            const userId = req.user.id // Lấy từ JWT
            const hasAccess = await User.hasPermission(userId, resource, action)

            if (!hasAccess) {
                return res
                    .status(403)
                    .json({ message: 'Forbidden: Không có quyền truy cập!' })
            }

            next()
        } catch (error) {
            res.status(500).json({ message: 'Lỗi kiểm tra quyền!' })
        }
    }
}
