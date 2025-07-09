"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// src/logger/logger.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
// Tạo thư mục logs nếu chưa có
const logDir = 'logs';
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
const { combine, timestamp, printf, colorize, errors } = winston_1.format;
// Tùy chỉnh format log
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
exports.logger = (0, winston_1.createLogger)({
    levels,
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), // log cả stack trace nếu là error
    logFormat),
    transports: [
        new winston_1.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error',
        }),
        new winston_1.transports.File({ filename: path_1.default.join(logDir, 'combined.log') }),
    ],
});
// Thêm console log khi không ở production
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.transports.Console({
        format: combine(colorize(), logFormat),
    }));
}
