"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawBodyMiddleware = rawBodyMiddleware;
function rawBodyMiddleware(req, res, next) {
    if (req.originalUrl === '/api/payments/webhook') {
        let data = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            req.rawBody = Buffer.from(data, 'utf8');
            next();
        });
    }
    else {
        next();
    }
}
