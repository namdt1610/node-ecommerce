export class ReviewNotFoundError extends Error {
    constructor(reviewId: string) {
        super(`Review with ID ${reviewId} not found`)
        this.name = 'ReviewNotFoundError'
    }
}

export class DuplicateReviewError extends Error {
    constructor(userId: string, productId: string) {
        super(`User ${userId} has already reviewed product ${productId}`)
        this.name = 'DuplicateReviewError'
    }
}

export class InvalidRatingError extends Error {
    constructor(rating: number) {
        super(`Invalid rating: ${rating}. Rating must be between 1 and 5`)
        this.name = 'InvalidRatingError'
    }
}

export class ReviewNotOwnedByUserError extends Error {
    constructor(reviewId: string, userId: string) {
        super(`Review ${reviewId} is not owned by user ${userId}`)
        this.name = 'ReviewNotOwnedByUserError'
    }
}

export class CannotReviewOwnProductError extends Error {
    constructor() {
        super('Cannot review your own product')
        this.name = 'CannotReviewOwnProductError'
    }
}
