import {
    NotFoundError,
    ValidationError,
    BusinessLogicError,
    UnauthorizedError,
} from '@/common/errors/base.error'

export class CartItemNotFoundError extends NotFoundError {
    constructor(itemId: string) {
        super('Cart item', itemId)
    }
}

export class ProductNotInCartError extends NotFoundError {
    constructor(productId: string) {
        super('Product in cart', productId)
    }
}

export class InvalidQuantityError extends ValidationError {
    constructor(quantity: number) {
        super(
            `Invalid quantity: ${quantity}. Quantity must be greater than 0`,
            'quantity'
        )
    }
}

export class CartEmptyError extends BusinessLogicError {
    constructor() {
        super('Cart is empty')
    }
}

export class ProductOutOfStockError extends BusinessLogicError {
    constructor(productName: string, availableStock: number) {
        super(
            `Product ${productName} has insufficient stock. Available: ${availableStock}`
        )
    }
}

export class InsufficientStockError extends BusinessLogicError {
    constructor(message: string) {
        super(message)
    }
}

export class UnauthorizedCartAccessError extends UnauthorizedError {
    constructor(message: string = 'Unauthorized cart access') {
        super(message)
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
