import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export function loggerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const start = Date.now()

    const oldJson = res.json.bind(res)
    const oldSend = res.send.bind(res)

    let responseBodySize = 0

    // Hook JSON response
    res.json = (body: any) => {
        const responseTime = Date.now() - start
        const json = JSON.stringify(body)
        responseBodySize = Buffer.byteLength(json, 'utf8')
        logRequest(req, res, responseTime, responseBodySize)
        return oldJson(body)
    }

    // Hook plain/text, HTML, etc
    res.send = (body: any) => {
        const responseTime = Date.now() - start
        const size =
            typeof body === 'string' ? Buffer.byteLength(body, 'utf8') : 0
        responseBodySize = size
        logRequest(req, res, responseTime, responseBodySize)
        return oldSend(body)
    }

    next()
}

function logRequest(
    req: Request,
    res: Response,
    responseTime: number,
    size: number
) {
    const sizeKB = (size / 1024).toFixed(2)
    const logMsg = `${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTime}ms - ${sizeKB} KB`

    if (res.statusCode >= 500) {
        logger.error(logMsg)
    } else if (res.statusCode >= 400) {
        logger.warn(logMsg)
    } else {
        logger.info(logMsg)
    }
}
