import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '@/models/UserModel'

interface AuthRequest extends Request {
    user?: { id: string; role: string }
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).json({ message: 'Unauthorized' })

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string
            role: string
        }

        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).json({ message: 'Unauthorized' })

        req.user = { id: String(user._id), role: user.role }

        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}
