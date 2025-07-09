"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductErrors = exports.ProductCreationError = exports.InvalidProductDataError = exports.ProductAlreadyExistsError = exports.ProductNotAvailableError = exports.ProductNotFoundError = void 0;
class ProductNotFoundError extends Error {
    constructor(productId) {
        super(`Product with ID ${productId} not found`);
        this.name = 'ProductNotFoundError';
    }
}
exports.ProductNotFoundError = ProductNotFoundError;
class ProductNotAvailableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ProductNotAvailableError';
    }
}
exports.ProductNotAvailableError = ProductNotAvailableError;
class ProductAlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ProductAlreadyExistsError';
    }
}
exports.ProductAlreadyExistsError = ProductAlreadyExistsError;
class InvalidProductDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidProductDataError';
    }
}
exports.InvalidProductDataError = InvalidProductDataError;
class ProductCreationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ProductCreationError';
    }
}
exports.ProductCreationError = ProductCreationError;
// Export all errors as part of ProductErrors namespace
exports.ProductErrors = {
    ProductNotFoundError,
    ProductNotAvailableError,
    ProductAlreadyExistsError,
    InvalidProductDataError,
    ProductCreationError,
};
