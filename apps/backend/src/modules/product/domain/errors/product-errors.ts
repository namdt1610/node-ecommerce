export class ProductNotFoundError extends Error {
    constructor(productId: string) {
        super(`Product with ID ${productId} not found`)
        this.name = 'ProductNotFoundError'
    }
}

export class ProductNotAvailableError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ProductNotAvailableError'
    }
}

export class ProductAlreadyExistsError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ProductAlreadyExistsError'
    }
}

export class InvalidProductDataError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'InvalidProductDataError'
    }
}

export class ProductCreationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ProductCreationError'
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
