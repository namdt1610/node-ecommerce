import { Request, Response, NextFunction } from 'express'

const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user
    const userIdFromParams = req.params.id

    if (user.role === 'admin' || user.userId === userIdFromParams) {
        next()
    } else {
        res.status(403).json({ message: 'Forbidden: No Permission' })
        return
    }
}

export default isAdmin
