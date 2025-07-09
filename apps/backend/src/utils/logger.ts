// src/logger/logger.ts
import fs from 'fs'
import path from 'path'
import { createLogger, format, transports } from 'winston'

// Tạo thư mục logs nếu chưa có
const logDir = 'logs'
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const { combine, timestamp, printf, colorize, errors } = format

// Tùy chỉnh format log
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`
})

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

export const logger = createLogger({
    levels,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // log cả stack trace nếu là error
        logFormat
    ),
    transports: [
        new transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
        }),
        new transports.File({ filename: path.join(logDir, 'combined.log') }),
    ],
})

// Thêm console log khi không ở production
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            format: combine(colorize(), logFormat),
        })
    )
}
