"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = '1', limit = '10' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        // Get reviews with user information
        const reviews = await database_1.default.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
        // Get review summary
        const allReviews = await database_1.default.review.findMany({
            where: { productId },
        });
        const totalReviews = allReviews.length;
        const averageRating = totalReviews > 0
            ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
                totalReviews
            : 0;
        const ratingDistribution = {
            1: allReviews.filter((r) => r.rating === 1).length,
            2: allReviews.filter((r) => r.rating === 2).length,
            3: allReviews.filter((r) => r.rating === 3).length,
            4: allReviews.filter((r) => r.rating === 4).length,
            5: allReviews.filter((r) => r.rating === 5).length,
        };
        res.json({
            success: true,
            data: {
                reviews: reviews.map((review) => ({
                    id: review.id,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.createdAt,
                    user: {
                        name: review.user.name,
                        avatar: review.user.avatar,
                    },
                })),
                summary: {
                    totalReviews,
                    averageRating: Math.round(averageRating * 10) / 10,
                    ratingDistribution,
                },
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalReviews,
                    pages: Math.ceil(totalReviews / Number(limit)),
                },
            },
        });
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
        });
    }
});
exports.default = router;
