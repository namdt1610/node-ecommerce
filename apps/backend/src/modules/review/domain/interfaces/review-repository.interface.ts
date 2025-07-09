import {
    Review,
    ReviewWithUser,
    CreateReviewData,
    UpdateReviewData,
    ReviewFilters,
    ReviewPagination,
    ReviewSummary,
} from '../entities/review.entity'

export interface IReviewRepository {
    findById(id: string): Promise<ReviewWithUser | null>
    findByProductId(
        productId: string,
        pagination: ReviewPagination,
        filters?: ReviewFilters
    ): Promise<ReviewWithUser[]>
    findByUserId(
        userId: string,
        pagination: ReviewPagination
    ): Promise<ReviewWithUser[]>
    create(data: CreateReviewData): Promise<Review>
    update(id: string, data: UpdateReviewData): Promise<Review>
    delete(id: string): Promise<void>
    getReviewSummary(productId: string): Promise<ReviewSummary>
    voteHelpful(
        reviewId: string,
        userId: string,
        isHelpful: boolean
    ): Promise<void>
    getUserReviewForProduct(
        userId: string,
        productId: string
    ): Promise<Review | null>
    count(filters?: ReviewFilters): Promise<number>
}
