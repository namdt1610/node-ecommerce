import { Request, Response, NextFunction } from 'express'
import { createError } from './error-handler.middleware'

export const adminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = (req as any).user
        if (!user) {
            throw createError('Authentication required', 401)
        }

        const userRole = user.role?.name?.toLowerCase()

        // Check if user has admin role
        if (userRole !== 'admin') {
            throw createError(
                `Admin access required. Current role: ${userRole || 'unknown'}`,
                403
            )
        }

        // Additional check: verify user has dashboard permissions
        const hasAdminPermissions = user.role.permissions?.some(
            (permission: any) =>
                permission.resource === 'dashboard' &&
                permission.action === 'read'
        )

        // For backward compatibility, allow admin role even without explicit dashboard permissions
        if (userRole === 'admin') {
            next()
            return
        }

        if (!hasAdminPermissions) {
            throw createError(
                'Insufficient permissions for admin dashboard access',
                403
            )
        }

        next()
    } catch (error) {
        next(error)
    }
}

export const requireAdminRole = (allowedRoles: string[] = ['admin']) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const user = (req as any).user
            if (!user) {
                throw createError('Authentication required', 401)
            }

            const userRole = user.role?.name?.toLowerCase()

            if (
                !allowedRoles
                    .map((role) => role.toLowerCase())
                    .includes(userRole)
            ) {
                throw createError(
                    `Access denied. Required roles: ${allowedRoles.join(', ')}. Current role: ${userRole || 'unknown'}`,
                    403
                )
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}
