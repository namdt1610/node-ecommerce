'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Review {
    id: string
    rating: number
    comment: string
    createdAt: string
    user: {
        name: string
        avatar?: string
    }
}

interface ReviewSummary {
    totalReviews: number
    averageRating: number
    ratingDistribution: {
        1: number
        2: number
        3: number
        4: number
        5: number
    }
}

interface ReviewsData {
    reviews: Review[]
    summary: ReviewSummary
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

interface ReviewsSectionProps {
    productId: string
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
    const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(
                `http://localhost:3030/api/reviews/product/${productId}`
            )

            if (!response.ok) {
                throw new Error('Failed to fetch reviews')
            }

            const data = await response.json()
            if (data.success) {
                setReviewsData(data.data)
            } else {
                throw new Error('Invalid response structure')
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to load reviews'
            )
        } finally {
            setLoading(false)
        }
    }, [productId])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
        const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

        return Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                className={`${sizeClass} ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))
    }

    const renderRatingBar = (rating: number, count: number, total: number) => {
        const percentage = total > 0 ? (count / total) * 100 : 0

        return (
            <div className="flex items-center space-x-3">
                <span className="text-sm font-medium w-8">{rating} sao</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                    {count}
                </span>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Đánh giá sản phẩm
                </h3>
                <div className="animate-pulse">
                    <div className="h-32 bg-gray-300 rounded-lg mb-4" />
                    <div className="h-24 bg-gray-300 rounded-lg mb-4" />
                    <div className="h-24 bg-gray-300 rounded-lg" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Đánh giá sản phẩm
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={fetchReviews}
                        className="mt-2 text-red-600 hover:text-red-800 underline"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        )
    }

    if (!reviewsData || reviewsData.summary.totalReviews === 0) {
        return (
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Đánh giá sản phẩm
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.13 8.13 0 01-2.939-.542l-3.618 1.208a.75.75 0 01-.935-.935l1.208-3.618A8.13 8.13 0 013 12a8 8 0 0116 0z"
                            />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Chưa có đánh giá nào
                    </h4>
                    <p className="text-gray-600">
                        Hãy là người đầu tiên đánh giá sản phẩm này!
                    </p>
                </div>
            </div>
        )
    }

    const { summary, reviews } = reviewsData

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Đánh giá sản phẩm
            </h3>

            {/* Rating Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Rating */}
                    <div className="text-center md:text-left">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                            {summary.averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center md:justify-start mb-2">
                            {renderStars(
                                Math.round(summary.averageRating),
                                'md'
                            )}
                        </div>
                        <p className="text-gray-600">
                            {summary.totalReviews} đánh giá
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating}>
                                {renderRatingBar(
                                    rating,
                                    summary.ratingDistribution[
                                        rating as keyof typeof summary.ratingDistribution
                                    ],
                                    summary.totalReviews
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white border border-gray-200 rounded-lg p-6"
                    >
                        <div className="flex items-start space-x-4">
                            {/* User Avatar */}
                            <div className="flex-shrink-0">
                                {review.user.avatar ? (
                                    <Image
                                        src={review.user.avatar}
                                        alt={review.user.name}
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded-full"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            {review.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Review Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-900">
                                        {review.user.name}
                                    </h4>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>

                                <div className="flex items-center mb-3">
                                    {renderStars(review.rating)}
                                </div>

                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button (if needed) */}
            {reviewsData.pagination.pages > 1 && (
                <div className="text-center mt-6">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Xem thêm đánh giá
                    </button>
                </div>
            )}
        </div>
    )
}
