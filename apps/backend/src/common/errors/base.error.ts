export abstract class BaseError extends Error {
    abstract readonly statusCode: number
    abstract readonly isOperational: boolean

    constructor(
        message: string,
        public readonly cause?: Error
    ) {
        super(message)
        this.name = this.constructor.name

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export class NotFoundError extends BaseError {
    readonly statusCode = 404
    readonly isOperational = true

    constructor(resource: string, identifier: string) {
        super(`${resource} with ID ${identifier} not found`)
    }
}

export class ValidationError extends BaseError {
    readonly statusCode = 400
    readonly isOperational = true

    constructor(
        message: string,
        public readonly field?: string
    ) {
        super(message)
    }
}

export class ConflictError extends BaseError {
    readonly statusCode = 409
    readonly isOperational = true

    constructor(message: string) {
        super(message)
    }
}

export class UnauthorizedError extends BaseError {
    readonly statusCode = 401
    readonly isOperational = true

    constructor(message: string = 'Unauthorized access') {
        super(message)
    }
}

export class ForbiddenError extends BaseError {
    readonly statusCode = 403
    readonly isOperational = true

    constructor(message: string = 'Forbidden access') {
        super(message)
    }
}

export class BusinessLogicError extends BaseError {
    readonly statusCode = 422
    readonly isOperational = true

    constructor(message: string) {
        super(message)
    }
}

export class InternalServerError extends BaseError {
    readonly statusCode = 500
    readonly isOperational = false

    constructor(message: string = 'Internal server error', cause?: Error) {
        super(message, cause)
    }
}
