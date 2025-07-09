"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistErrors = exports.ItemAlreadyInWishlistError = exports.WishlistEmptyError = exports.ProductAlreadyInWishlistError = exports.WishlistItemNotFoundError = void 0;
class WishlistItemNotFoundError extends Error {
    constructor(productId) {
        super(`Product ${productId} is not in wishlist`);
        this.name = 'WishlistItemNotFoundError';
    }
}
exports.WishlistItemNotFoundError = WishlistItemNotFoundError;
class ProductAlreadyInWishlistError extends Error {
    constructor(productId) {
        super(`Product ${productId} is already in wishlist`);
        this.name = 'ProductAlreadyInWishlistError';
    }
}
exports.ProductAlreadyInWishlistError = ProductAlreadyInWishlistError;
class WishlistEmptyError extends Error {
    constructor() {
        super('Wishlist is empty');
        this.name = 'WishlistEmptyError';
    }
}
exports.WishlistEmptyError = WishlistEmptyError;
class ItemAlreadyInWishlistError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ItemAlreadyInWishlistError';
    }
}
exports.ItemAlreadyInWishlistError = ItemAlreadyInWishlistError;
// Export all errors as part of WishlistErrors namespace
exports.WishlistErrors = {
    WishlistItemNotFoundError,
    ProductAlreadyInWishlistError,
    WishlistEmptyError,
    ItemAlreadyInWishlistError,
};
