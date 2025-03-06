import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie'
import { Request, Response, NextFunction } from 'express'

interface AuthRequest extends Request {
    user?: { userId: string; role: 'admin' | 'user' }
}

export const decodeToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = Cookies.get('user')

    if (!token) {
        res.status(401).json({ message: 'You are not logged in' })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: string
            role: 'admin' | 'user'
        }
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
        return
    }
}
