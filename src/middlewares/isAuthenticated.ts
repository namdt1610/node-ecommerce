import { NextFunction, Request, Response } from 'express'

// Middleware kiểm tra quyền truy cập dựa trên role
export const isAuthorized = (roles: ('admin' | 'user')[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = req.cookies['role'] // Lấy role từ cookie (giả sử cookie lưu role của người dùng)

        if (!userRole || !roles.includes(userRole)) {
            res.status(403).json({
                message: 'Forbidden: No permission.',
            })
            return
        }

        next()
    }
}
