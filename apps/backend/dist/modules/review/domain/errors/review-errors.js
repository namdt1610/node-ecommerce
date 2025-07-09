"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotReviewOwnProductError = exports.ReviewNotOwnedByUserError = exports.InvalidRatingError = exports.DuplicateReviewError = exports.ReviewNotFoundError = void 0;
class ReviewNotFoundError extends Error {
    constructor(reviewId) {
        super(`Review with ID ${reviewId} not found`);
        this.name = 'ReviewNotFoundError';
    }
}
exports.ReviewNotFoundError = ReviewNotFoundError;
class DuplicateReviewError extends Error {
    constructor(userId, productId) {
        super(`User ${userId} has already reviewed product ${productId}`);
        this.name = 'DuplicateReviewError';
    }
}
exports.DuplicateReviewError = DuplicateReviewError;
class InvalidRatingError extends Error {
    constructor(rating) {
        super(`Invalid rating: ${rating}. Rating must be between 1 and 5`);
        this.name = 'InvalidRatingError';
    }
}
exports.InvalidRatingError = InvalidRatingError;
class ReviewNotOwnedByUserError extends Error {
    constructor(reviewId, userId) {
        super(`Review ${reviewId} is not owned by user ${userId}`);
        this.name = 'ReviewNotOwnedByUserError';
    }
}
exports.ReviewNotOwnedByUserError = ReviewNotOwnedByUserError;
class CannotReviewOwnProductError extends Error {
    constructor() {
        super('Cannot review your own product');
        this.name = 'CannotReviewOwnProductError';
    }
}
exports.CannotReviewOwnProductError = CannotReviewOwnProductError;
