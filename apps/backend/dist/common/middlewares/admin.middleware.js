"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminRole = exports.adminMiddleware = void 0;
const error_handler_middleware_1 = require("./error-handler.middleware");
const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, error_handler_middleware_1.createError)('Authentication required', 401);
        }
        const userRole = req.user.role?.name?.toLowerCase();
        // Check if user has admin role
        if (userRole !== 'admin') {
            throw (0, error_handler_middleware_1.createError)(`Admin access required. Current role: ${userRole || 'unknown'}`, 403);
        }
        // Additional check: verify user has dashboard permissions
        const hasAdminPermissions = req.user.role.permissions?.some((permission) => permission.resource === 'dashboard' &&
            permission.action === 'read');
        // For backward compatibility, allow admin role even without explicit dashboard permissions
        if (userRole === 'admin') {
            next();
            return;
        }
        if (!hasAdminPermissions) {
            throw (0, error_handler_middleware_1.createError)('Insufficient permissions for admin dashboard access', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.adminMiddleware = adminMiddleware;
const requireAdminRole = (allowedRoles = ['admin']) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw (0, error_handler_middleware_1.createError)('Authentication required', 401);
            }
            const userRole = req.user.role?.name?.toLowerCase();
            if (!allowedRoles
                .map((role) => role.toLowerCase())
                .includes(userRole)) {
                throw (0, error_handler_middleware_1.createError)(`Access denied. Required roles: ${allowedRoles.join(', ')}. Current role: ${userRole || 'unknown'}`, 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireAdminRole = requireAdminRole;
