export interface Review {
    id: string
    userId: string
    productId: string
    orderId?: string
    rating: number // 1-5 stars
    title: string
    comment: string
    pros: string[]
    cons: string[]
    isVerifiedPurchase: boolean
    isRecommended: boolean
    helpfulVotes: number
    totalVotes: number
    images: string[]
    status: ReviewStatus
    moderatorNotes?: string
    createdAt: Date
    updatedAt: Date
}

export interface ReviewWithUser {
    id: string
    userId: string
    userName: string
    userAvatar?: string
    productId: string
    orderId?: string
    rating: number
    title: string
    comment: string
    pros: string[]
    cons: string[]
    isVerifiedPurchase: boolean
    isRecommended: boolean
    helpfulVotes: number
    totalVotes: number
    images: string[]
    status: ReviewStatus
    createdAt: Date
    updatedAt: Date
}

export enum ReviewStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    HIDDEN = 'HIDDEN',
}

export interface CreateReviewData {
    userId: string
    productId: string
    orderId?: string
    rating: number
    title: string
    comment: string
    pros?: string[]
    cons?: string[]
    isRecommended: boolean
    images?: string[]
}

export interface UpdateReviewData {
    rating?: number
    title?: string
    comment?: string
    pros?: string[]
    cons?: string[]
    isRecommended?: boolean
    images?: string[]
}

export interface ReviewFilters {
    productId?: string
    userId?: string
    rating?: number[]
    status?: ReviewStatus[]
    isVerifiedPurchase?: boolean
    isRecommended?: boolean
    dateFrom?: Date
    dateTo?: Date
}

export interface ReviewPagination {
    page: number
    limit: number
    sortBy?: 'createdAt' | 'rating' | 'helpfulVotes'
    sortOrder?: 'asc' | 'desc'
}

export interface ReviewSummary {
    totalReviews: number
    averageRating: number
    ratingDistribution: {
        1: number
        2: number
        3: number
        4: number
        5: number
    }
    recommendationPercentage: number
}
