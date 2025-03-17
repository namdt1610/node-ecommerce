import express from 'express'
import ReviewController from '@/controllers/ReviewController'
import verifyToken from '@/middlewares/verifyToken'
import { isAdmin } from '@/middlewares/isAdmin'

const router = express.Router()

// Public routes
router.get('/product/:productId', ReviewController.getReviewsByProductId)
router.get('/average/:productId', ReviewController.getAverageRating)
router.get(
    '/:productId/:userId',
    ReviewController.getReviewsByProductIdAndUserId
)

// Protected routes
router.post('/', verifyToken, ReviewController.createReview)
router.get('/user/:userId', verifyToken, ReviewController.getReviewsByUserId)
router.put('/:reviewId', verifyToken, ReviewController.updateReview)
router.delete('/:reviewId', verifyToken, ReviewController.deleteReview)

export default router
