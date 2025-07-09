import { Request, Response, NextFunction } from 'express'

declare global {
    namespace Express {
        interface Request {
            rawBody?: Buffer
        }
    }
}

export function rawBodyMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (req.originalUrl === '/api/payments/webhook') {
        let data = ''
        req.setEncoding('utf8')

        req.on('data', (chunk: string) => {
            data += chunk
        })

        req.on('end', () => {
            req.rawBody = Buffer.from(data, 'utf8')
            next()
        })
    } else {
        next()
    }
}
