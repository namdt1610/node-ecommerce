'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Star,
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    MoreHorizontal,
    Filter,
    SortDesc,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { formatDate } from '@/shared/utils'

interface Review {
    id: string
    userId: string
    userName: string
    userAvatar?: string
    rating: number
    title: string
    content: string
    createdAt: string
    likes: number
    dislikes: number
    isVerifiedPurchase: boolean
    images?: string[]
    helpful: number
}

interface ReviewsSectionProps {
    reviews?: Review[]
    averageRating?: number
    totalReviews?: number
}

export default function ReviewsSection({
    reviews = [],
    averageRating = 4.2,
    totalReviews = 0,
}: ReviewsSectionProps) {
    const [sortBy, setSortBy] = useState<
        'newest' | 'oldest' | 'highest' | 'lowest'
    >('newest')
    const [filterBy, setFilterBy] = useState<
        'all' | '5' | '4' | '3' | '2' | '1'
    >('all')

    // Mock data for demonstration
    const mockReviews: Review[] = [
        {
            id: '1',
            userId: '1',
            userName: 'Nguyễn Văn A',
            userAvatar: '/avatars/user1.jpg',
            rating: 5,
            title: 'Sản phẩm tuyệt vời!',
            content:
                'Mình rất hài lòng với sản phẩm này. Chất lượng tốt, giao hàng nhanh. Sẽ mua lại lần sau.',
            createdAt: '2024-01-15T10:30:00Z',
            likes: 12,
            dislikes: 1,
            helpful: 11,
            isVerifiedPurchase: true,
            images: ['/reviews/review1-1.jpg', '/reviews/review1-2.jpg'],
        },
        {
            id: '2',
            userId: '2',
            userName: 'Trần Thị B',
            rating: 4,
            title: 'Tốt nhưng có thể cải thiện',
            content:
                'Sản phẩm ổn, đúng như mô tả. Tuy nhiên bao bì có thể cải thiện thêm một chút.',
            createdAt: '2024-01-10T14:20:00Z',
            likes: 8,
            dislikes: 2,
            helpful: 6,
            isVerifiedPurchase: true,
        },
        {
            id: '3',
            userId: '3',
            userName: 'Lê Văn C',
            rating: 3,
            title: 'Bình thường',
            content: 'Sản phẩm bình thường, không có gì đặc biệt.',
            createdAt: '2024-01-05T09:15:00Z',
            likes: 3,
            dislikes: 5,
            helpful: -2,
            isVerifiedPurchase: false,
        },
    ]

    const displayReviews = reviews.length > 0 ? reviews : mockReviews

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                }`}
            />
        ))
    }

    const renderRatingDistribution = () => {
        const distribution = [
            { stars: 5, count: 45, percentage: 60 },
            { stars: 4, count: 20, percentage: 27 },
            { stars: 3, count: 8, percentage: 11 },
            { stars: 2, count: 2, percentage: 3 },
            { stars: 1, count: 0, percentage: 0 },
        ]

        return (
            <div className="space-y-2">
                {distribution.map(({ stars, count, percentage }) => (
                    <div
                        key={stars}
                        className="flex items-center gap-2 text-sm"
                    >
                        <span className="w-8">{stars} ⭐</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <span className="w-8 text-muted-foreground">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Reviews Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Đánh giá sản phẩm
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Overall Rating */}
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">
                                {averageRating}
                            </div>
                            <div className="flex justify-center mb-2">
                                {renderStars(Math.round(averageRating))}
                            </div>
                            <p className="text-muted-foreground">
                                {totalReviews || displayReviews.length} đánh giá
                            </p>
                        </div>

                        {/* Rating Distribution */}
                        <div>
                            <h4 className="font-medium mb-3">
                                Phân bố đánh giá
                            </h4>
                            {renderRatingDistribution()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters and Sort */}
            <div className="flex flex-wrap gap-2 justify-between items-center">
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Lọc:{' '}
                                {filterBy === 'all'
                                    ? 'Tất cả'
                                    : `${filterBy} sao`}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => setFilterBy('all')}
                            >
                                Tất cả
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterBy('5')}>
                                5 sao
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterBy('4')}>
                                4 sao
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterBy('3')}>
                                3 sao
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterBy('2')}>
                                2 sao
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterBy('1')}>
                                1 sao
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <SortDesc className="h-4 w-4 mr-2" />
                                Sắp xếp:{' '}
                                {sortBy === 'newest'
                                    ? 'Mới nhất'
                                    : sortBy === 'oldest'
                                      ? 'Cũ nhất'
                                      : sortBy === 'highest'
                                        ? 'Đánh giá cao'
                                        : 'Đánh giá thấp'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => setSortBy('newest')}
                            >
                                Mới nhất
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortBy('oldest')}
                            >
                                Cũ nhất
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortBy('highest')}
                            >
                                Đánh giá cao nhất
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortBy('lowest')}
                            >
                                Đánh giá thấp nhất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Button>Viết đánh giá</Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {displayReviews.map((review) => (
                    <Card key={review.id}>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {/* Review Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={review.userAvatar}
                                            />
                                            <AvatarFallback>
                                                {review.userName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {review.userName}
                                                </span>
                                                {review.isVerifiedPurchase && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        Đã mua hàng
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDate(
                                                        review.createdAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>
                                                Báo cáo
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Review Content */}
                                <div>
                                    <h4 className="font-medium mb-2">
                                        {review.title}
                                    </h4>
                                    <p className="text-sm leading-relaxed">
                                        {review.content}
                                    </p>
                                </div>

                                {/* Review Images */}
                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto">
                                        {review.images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden relative"
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`Review ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Separator />

                                {/* Review Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button variant="ghost" size="sm">
                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                            Hữu ích ({review.likes})
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <ThumbsDown className="h-4 w-4 mr-1" />
                                            ({review.dislikes})
                                        </Button>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {review.helpful > 0
                                            ? `${review.helpful} người thấy hữu ích`
                                            : ''}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
