import { NextFunction, Request, Response } from 'express'
import { UnitOfWork } from '@/repositories/unitOfWork'

interface UoWRequest extends Request {
    uow?: UnitOfWork
}

export const uowMiddleware = async (
    req: UoWRequest,
    res: Response,
    next: NextFunction
) => {
    req.uow = new UnitOfWork()
    await req.uow.start()
    try {
        await next()
        await req.uow.commit()
    } catch (error) {
        await req.uow.rollback()
        next(error)
    }
}
