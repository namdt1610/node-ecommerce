import { uowWrapper } from '@/utils/uowWrapper'
import mongoose from 'mongoose'

export class ReviewService {
    async getReviewById(reviewId: string) {
        return uowWrapper(async (uow) => {
            const review = await uow.reviewRepository.findById(reviewId)
            if (!review) throw new Error('Review not found')
            return review
        })
    }

    async getReviewsByProductId(
        productId: string,
        options = { limit: 10, page: 1 }
    ) {
        return uowWrapper(async (uow) => {
            return uow.reviewRepository.findByProductId(productId, options)
        })
    }

    async getReviewsByUserId(userId: string) {
        return uowWrapper(async (uow) => {
            return uow.reviewRepository.findByUserId(userId)
        })
    }

    async createReview(
        userId: string,
        productId: string,
        rating: number,
        comment: string
    ) {
        return uowWrapper(async (uow) => {
            // Could add validation here
            if (rating < 1 || rating > 5) {
                throw new Error('Rating must be between 1 and 5')
            }

            const review = await uow.reviewRepository.createReview({
                userId,
                productId,
                rating,
                comment,
            })

            // Calculate new average rating
            const averageRating =
                await uow.reviewRepository.getAverageRatingByProductId(
                    productId
                )

            // Could update product's average rating here if needed
            // await uow.productRepository.updateRating(productId, averageRating.averageRating)

            return review
        })
    }

    async updateReview(
        reviewId: string,
        userId: string,
        updateData: { rating?: number; comment?: string }
    ) {
        return uowWrapper(async (uow) => {
            const review = await uow.reviewRepository.findById(reviewId)

            if (!review) throw new Error('Review not found')

            // Ensure user owns the review
            if (review.userId.toString() !== userId) {
                throw new Error('Not authorized to update this review')
            }

            if (
                updateData.rating &&
                (updateData.rating < 1 || updateData.rating > 5)
            ) {
                throw new Error('Rating must be between 1 and 5')
            }

            const updatedReview = await uow.reviewRepository.updateReview(
                reviewId,
                updateData
            )

            // Recalculate average rating if rating was updated
            if (updateData.rating) {
                const averageRating =
                    await uow.reviewRepository.getAverageRatingByProductId(
                        review.productId.toString()
                    )
                // Could update product's average rating here if needed
            }

            return updatedReview
        })
    }

    async deleteReview(reviewId: string, userId: string) {
        return uowWrapper(async (uow) => {
            const review = await uow.reviewRepository.findById(reviewId)

            if (!review) throw new Error('Review not found')

            // Ensure user owns the review or is admin
            if (review.userId.toString() !== userId) {
                throw new Error('Not authorized to delete this review')
            }

            const productId = review.productId.toString()
            await uow.reviewRepository.deleteReview(reviewId)

            // Recalculate average rating
            const averageRating =
                await uow.reviewRepository.getAverageRatingByProductId(
                    productId
                )

            return { message: 'Review deleted successfully' }
        })
    }

    async getProductRating(productId: string) {
        return uowWrapper(async (uow) => {
            return uow.reviewRepository.getAverageRatingByProductId(productId)
        })
    }
}
