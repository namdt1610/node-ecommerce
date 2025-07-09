import { Request, Response, NextFunction } from 'express'

export interface ApiError extends Error {
    statusCode?: number
    isOperational?: boolean
}

export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { statusCode = 500, message } = err

    console.error(`Error ${statusCode}: ${message}`)
    console.error(err.stack)

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal Server Error' : message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
}

export const createError = (
    message: string,
    statusCode: number = 500
): ApiError => {
    const error = new Error(message) as ApiError
    error.statusCode = statusCode
    error.isOperational = true
    return error
}

export const asyncHandler =
    (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
