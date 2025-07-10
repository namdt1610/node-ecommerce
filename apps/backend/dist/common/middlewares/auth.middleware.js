"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const user_repository_1 = require("../../modules/user/infrastructure/repositories/user.repository");
const error_handler_middleware_1 = require("./error-handler.middleware");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw (0, error_handler_middleware_1.createError)('Authentication required', 401);
        }
        const secret = process.env.JWT_SECRET || 'your-default-secret';
        const decoded = jwt.verify(token, secret);
        const userRepository = new user_repository_1.PrismaUserRepo();
        const user = await userRepository.findById(decoded.userId);
        if (!user) {
            throw (0, error_handler_middleware_1.createError)('User not found', 401);
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const secret = process.env.JWT_ACCESS_SECRET ||
                process.env.JWT_SECRET ||
                'your-default-secret';
            const decoded = jwt.verify(token, secret);
            const userRepository = new user_repository_1.PrismaUserRepo();
            const user = await userRepository.findById(decoded.userId);
            if (user) {
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        // For optional auth, we don't throw errors
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
