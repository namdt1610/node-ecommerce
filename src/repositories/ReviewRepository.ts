import mongoose from 'mongoose'
import Review from '@/models/ReviewModel'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\repositories\ReviewRepository.ts

export class ReviewRepository {
      private session: mongoose.ClientSession | null = null

      setSession(session: mongoose.ClientSession) {
            this.session = session
      }

      async findById(reviewId: string) {
            return Review.findById(reviewId).session(this.session as any)
      }

      async findByProductId(productId: string, options = { limit: 10, page: 1 }) {
            const skip = (options.page - 1) * options.limit
            
            return Review.find({ productId })
                  .skip(skip)
                  .limit(options.limit)
                  .sort({ createdAt: -1 })
                  .session(this.session as any)
      }

      async findByUserId(userId: string) {
            return Review.find({ userId })
                  .sort({ createdAt: -1 })
                  .session(this.session as any)
      }

      async createReview(reviewData: {
            userId: string,
            productId: string,
            rating: number,
            comment: string
      }) {
            const [review] = await Review.create([reviewData], {
                  session: this.session as any,
            })
            return review
      }

      async updateReview(reviewId: string, updateData: {
            rating?: number,
            comment?: string
      }) {
            return Review.findByIdAndUpdate(
                  reviewId,
                  updateData,
                  { new: true }
            ).session(this.session as any)
      }

      async deleteReview(reviewId: string) {
            return Review.deleteOne({ _id: reviewId }).session(this.session as any)
      }

      async getAverageRatingByProductId(productId: string) {
            const result = await Review.aggregate([
                  { $match: { productId: new mongoose.Types.ObjectId(productId) } },
                  { $group: { _id: "$productId", averageRating: { $avg: "$rating" }, count: { $sum: 1 } } }
            ]).session(this.session as any)
            
            return result.length ? result[0] : { averageRating: 0, count: 0 }
      }
}