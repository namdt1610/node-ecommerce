"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAccessTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtAccessTokenService {
    generate(userId) {
        const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_ACCESS_SECRET or JWT_SECRET environment variable is required');
        }
        return jsonwebtoken_1.default.sign({ userId }, secret, {
            expiresIn: '15m',
        });
    }
}
exports.JwtAccessTokenService = JwtAccessTokenService;
