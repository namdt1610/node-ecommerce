import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    // console.log('Token received:', token)
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_SECRET as string
        ) as { userId: string; role: string }
        ;(req as any).user = decoded
        next()
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' })
    }
}

export default verifyToken
