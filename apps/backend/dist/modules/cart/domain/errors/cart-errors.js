"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartErrors = exports.UnauthorizedCartAccessError = exports.InsufficientStockError = exports.ProductOutOfStockError = exports.CartEmptyError = exports.InvalidQuantityError = exports.ProductNotInCartError = exports.CartItemNotFoundError = void 0;
class CartItemNotFoundError extends Error {
    constructor(itemId) {
        super(`Cart item with ID ${itemId} not found`);
        this.name = 'CartItemNotFoundError';
    }
}
exports.CartItemNotFoundError = CartItemNotFoundError;
class ProductNotInCartError extends Error {
    constructor(productId) {
        super(`Product ${productId} is not in cart`);
        this.name = 'ProductNotInCartError';
    }
}
exports.ProductNotInCartError = ProductNotInCartError;
class InvalidQuantityError extends Error {
    constructor(quantity) {
        super(`Invalid quantity: ${quantity}. Quantity must be greater than 0`);
        this.name = 'InvalidQuantityError';
    }
}
exports.InvalidQuantityError = InvalidQuantityError;
class CartEmptyError extends Error {
    constructor() {
        super('Cart is empty');
        this.name = 'CartEmptyError';
    }
}
exports.CartEmptyError = CartEmptyError;
class ProductOutOfStockError extends Error {
    constructor(productName, availableStock) {
        super(`Product ${productName} has insufficient stock. Available: ${availableStock}`);
        this.name = 'ProductOutOfStockError';
    }
}
exports.ProductOutOfStockError = ProductOutOfStockError;
class InsufficientStockError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InsufficientStockError';
    }
}
exports.InsufficientStockError = InsufficientStockError;
class UnauthorizedCartAccessError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedCartAccessError';
    }
}
exports.UnauthorizedCartAccessError = UnauthorizedCartAccessError;
// Export all errors as part of CartErrors namespace
exports.CartErrors = {
    CartItemNotFoundError,
    ProductNotInCartError,
    InvalidQuantityError,
    CartEmptyError,
    ProductOutOfStockError,
    InsufficientStockError,
    UnauthorizedCartAccessError,
};
