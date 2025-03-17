// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\controllers\ReviewController.ts
import { NextFunction, Request, Response } from 'express'
import { ReviewService } from '@/services/ReviewService'

interface ReviewRequest extends Request {
    user?: string
}

class ReviewController {
    private reviewService: ReviewService

    constructor() {
        this.reviewService = new ReviewService()
        this.createReview = this.createReview.bind(this)
        this.getReviewsByProductId = this.getReviewsByProductId.bind(this)
        this.getReviewsByUserId = this.getReviewsByUserId.bind(this)
        this.updateReview = this.updateReview.bind(this)
        this.deleteReview = this.deleteReview.bind(this)
        this.getAverageRating = this.getAverageRating.bind(this)
        this.getReviewsByProductIdAndUserId =
            this.getReviewsByProductIdAndUserId.bind(this)
    }

    async createReview(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId, userId, rating, comment } = req.body
            const review = await this.reviewService.createReview(
                userId,
                productId,
                rating,
                comment
            )
            res.status(201).json(review)
        } catch (error) {
            next(error)
        }
    }

    async getReviewsByProductId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId } = req.params
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            const reviews = await this.reviewService.getReviewsByProductId(
                productId,
                { page, limit }
            )
            res.json(reviews)
        } catch (error) {
            next(error)
        }
    }

    async getReviewsByUserId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { userId } = req.params
            const reviews = await this.reviewService.getReviewsByUserId(userId)
            res.json(reviews)
        } catch (error) {
            next(error)
        }
    }

    async updateReview(
        req: ReviewRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { reviewId } = req.params
            const { rating, comment } = req.body
            const userId = req.body.userId || (req.user as any)?.userId

            const review = await this.reviewService.updateReview(
                reviewId,
                userId,
                { rating, comment }
            )
            res.json(review)
        } catch (error) {
            next(error)
        }
    }

    async deleteReview(
        req: ReviewRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { reviewId } = req.params
            const userId = req.body.userId || (req.user as any)?.userId

            const result = await this.reviewService.deleteReview(
                reviewId,
                userId
            )
            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAverageRating(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId } = req.params
            const rating = await this.reviewService.getProductRating(productId)
            res.json(rating)
        } catch (error) {
            next(error)
        }
    }

    async getReviewsByProductIdAndUserId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId, userId } = req.params
            const reviews =
                await this.reviewService.getReviewsByProductId(productId)
            const filteredReviews = reviews.filter(
                (review) => review.userId.toString() === userId
            )
            res.json(filteredReviews)
        } catch (error) {
            next(error)
        }
    }
}

export default new ReviewController()
