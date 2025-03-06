import { Router } from 'express'
import {
    createReview,
    deleteReview,
    getAverageRating,
    getReviewsByProductId,
    getReviewsByProductIdAndUserId,
    getReviewsByUserId,
    updateReview,
} from '../controllers/ReviewController'

const router = Router()

router.post('/', createReview)
router.get('/product/:productId', getReviewsByProductId)
router.get('/user/:userId', getReviewsByUserId)
router.put('/:reviewId', updateReview)
router.delete('/:reviewId', deleteReview)
router.get('/average/:productId', getAverageRating)
router.get('/:productId/:userId', getReviewsByProductIdAndUserId)

export default router
