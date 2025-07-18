import { Request, Response } from 'express'
import {
    ApiResponse,
    PaginationParams,
    PaginationResult,
} from '../types/shared.types'
import { BaseError } from '../errors/base.error'

/**
 * Base Controller class that provides common functionality
 * This eliminates duplicate controller patterns across modules
 */
export abstract class BaseController {
    /**
     * Send success response
     */
    protected sendSuccess<T>(
        res: Response,
        data?: T,
        message?: string,
        statusCode: number = 200
    ): Response {
        const response: ApiResponse<T> = {
            success: true,
            message,
            data,
        }
        return res.status(statusCode).json(response)
    }

    /**
     * Send error response
     */
    protected sendError(
        res: Response,
        error: Error | BaseError,
        statusCode?: number
    ): Response {
        const code =
            statusCode || (error instanceof BaseError ? error.statusCode : 500)

        const response: ApiResponse = {
            success: false,
            message: error.message,
        }

        // Add stack trace in development
        if (process.env.NODE_ENV === 'development' && error.stack) {
            response.meta = { stack: error.stack }
        }

        return res.status(code).json(response)
    }

    /**
     * Send validation error response
     */
    protected sendValidationError(
        res: Response,
        errors: Array<{ field: string; message: string }>,
        message: string = 'Validation failed'
    ): Response {
        const response: ApiResponse = {
            success: false,
            message,
            errors,
        }
        return res.status(400).json(response)
    }

    /**
     * Send paginated response
     */
    protected sendPaginatedResponse<T>(
        res: Response,
        result: PaginationResult<T>,
        message?: string
    ): Response {
        const response: ApiResponse<T[]> = {
            success: true,
            message,
            data: result.data,
            meta: {
                pagination: result.pagination,
            },
        }
        return res.status(200).json(response)
    }

    /**
     * Extract pagination parameters from request
     */
    protected extractPaginationParams(req: Request): PaginationParams {
        const page = Math.max(1, parseInt(req.query.page as string) || 1)
        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit as string) || 10)
        )
        const sortBy = req.query.sortBy as string
        const sortOrder =
            (req.query.sortOrder as string)?.toLowerCase() === 'desc'
                ? 'desc'
                : 'asc'

        return { page, limit, sortBy, sortOrder }
    }

    /**
     * Extract user ID from authenticated request
     */
    protected extractUserId(req: Request): string {
        const user = (req as any).user
        if (!user?.id) {
            throw new Error('User not authenticated')
        }
        return user.id
    }

    /**
     * Extract ID parameter from request
     */
    protected extractIdParam(req: Request, paramName: string = 'id'): string {
        const id = req.params[paramName]
        if (!id) {
            throw new Error(`${paramName} parameter is required`)
        }
        return id
    }

    /**
     * Validate required fields in request body
     */
    protected validateRequiredFields(
        body: any,
        requiredFields: string[]
    ): Array<{ field: string; message: string }> {
        const errors: Array<{ field: string; message: string }> = []

        requiredFields.forEach((field) => {
            if (!body[field] && body[field] !== 0 && body[field] !== false) {
                errors.push({
                    field,
                    message: `${field} is required`,
                })
            }
        })

        return errors
    }

    /**
     * Handle async operations with error catching
     */
    protected async handleAsync<T>(
        res: Response,
        operation: () => Promise<T>,
        successMessage?: string,
        successStatusCode?: number
    ): Promise<Response> {
        try {
            const result = await operation()
            return this.sendSuccess(
                res,
                result,
                successMessage,
                successStatusCode
            )
        } catch (error) {
            return this.sendError(res, error as Error)
        }
    }
}
