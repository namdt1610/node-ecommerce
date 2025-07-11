import {
    NotFoundError,
    ValidationError,
    ConflictError,
    BusinessLogicError,
} from '@/common/errors/base.error'

export class ProductNotFoundError extends NotFoundError {
    constructor(productId: string) {
        super('Product', productId)
    }
}

export class ProductNotAvailableError extends BusinessLogicError {
    constructor(message: string) {
        super(message)
    }
}

export class ProductAlreadyExistsError extends ConflictError {
    constructor(message: string) {
        super(message)
    }
}

export class InvalidProductDataError extends ValidationError {
    constructor(message: string, field?: string) {
        super(message, field)
    }
}

export class ProductCreationError extends BusinessLogicError {
    constructor(message: string) {
        super(message)
    }
}

// Export all errors as part of ProductErrors namespace
export const ProductErrors = {
    ProductNotFoundError,
    ProductNotAvailableError,
    ProductAlreadyExistsError,
    InvalidProductDataError,
    ProductCreationError,
}
