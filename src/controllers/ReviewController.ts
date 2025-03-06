import Review from '../models/ReviewModel'
import { Request, Response } from 'express'

export const createReview = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { productId, userId, rating, comment } = req.body
    try {
        const review = new Review({ productId, userId, rating, comment })
        await review.save()
        res.status(201).json(review)
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error: error })
    }
}

export const getReviewsByProductId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { productId } = req.params
    const reviews = await Review.find({ productId })
    res.json(reviews)
}

export const getReviewsByUserId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId } = req.params
    const reviews = await Review.find({ userId })
    res.json(reviews)
}

export const updateReview = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { reviewId } = req.params
    const { rating, comment } = req.body
    const review = await Review.findByIdAndUpdate(
        reviewId,
        { rating, comment },
        { new: true }
    )
    res.json(review)
}

export const deleteReview = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    res.json({ message: 'Review deleted successfully' })
}

export const getAverageRating = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { productId } = req.params
    const reviews = await Review.find({ productId })
    const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    res.json({ averageRating })
}

export const getReviewsByProductIdAndUserId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { productId, userId } = req.params
    const reviews = await Review.find({ productId, userId })
    res.json(reviews)
}
