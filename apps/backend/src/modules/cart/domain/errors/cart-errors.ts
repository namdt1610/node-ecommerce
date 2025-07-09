export class CartItemNotFoundError extends Error {
    constructor(itemId: string) {
        super(`Cart item with ID ${itemId} not found`)
        this.name = 'CartItemNotFoundError'
    }
}

export class ProductNotInCartError extends Error {
    constructor(productId: string) {
        super(`Product ${productId} is not in cart`)
        this.name = 'ProductNotInCartError'
    }
}

export class InvalidQuantityError extends Error {
    constructor(quantity: number) {
        super(`Invalid quantity: ${quantity}. Quantity must be greater than 0`)
        this.name = 'InvalidQuantityError'
    }
}

export class CartEmptyError extends Error {
    constructor() {
        super('Cart is empty')
        this.name = 'CartEmptyError'
    }
}

export class ProductOutOfStockError extends Error {
    constructor(productName: string, availableStock: number) {
        super(
            `Product ${productName} has insufficient stock. Available: ${availableStock}`
        )
        this.name = 'ProductOutOfStockError'
    }
}

export class InsufficientStockError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'InsufficientStockError'
    }
}

export class UnauthorizedCartAccessError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UnauthorizedCartAccessError'
    }
}

// Export all errors as part of CartErrors namespace
export const CartErrors = {
    CartItemNotFoundError,
    ProductNotInCartError,
    InvalidQuantityError,
    CartEmptyError,
    ProductOutOfStockError,
    InsufficientStockError,
    UnauthorizedCartAccessError,
}
