export class WishlistItemNotFoundError extends Error {
    constructor(productId: string) {
        super(`Product ${productId} is not in wishlist`)
        this.name = 'WishlistItemNotFoundError'
    }
}

export class ProductAlreadyInWishlistError extends Error {
    constructor(productId: string) {
        super(`Product ${productId} is already in wishlist`)
        this.name = 'ProductAlreadyInWishlistError'
    }
}

export class WishlistEmptyError extends Error {
    constructor() {
        super('Wishlist is empty')
        this.name = 'WishlistEmptyError'
    }
}

export class ItemAlreadyInWishlistError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ItemAlreadyInWishlistError'
    }
}

// Export all errors as part of WishlistErrors namespace
export const WishlistErrors = {
    WishlistItemNotFoundError,
    ProductAlreadyInWishlistError,
    WishlistEmptyError,
    ItemAlreadyInWishlistError,
}
