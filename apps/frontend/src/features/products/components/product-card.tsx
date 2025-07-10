'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Product } from '@/shared/types'
import { formatPrice, calculateDiscount } from '@/shared/utils'

interface ProductCardProps {
    product: Product
    onAddToCart?: (productId: string) => void
    onToggleWishlist?: (productId: string) => void
}

export default function ProductCard({ product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const discount = product.originalPrice
        ? calculateDiscount(product.originalPrice, product.price)
        : 0

    return (
        <Card className="group overflow-hidden border transition-all hover:shadow-lg">
            <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                    <Link href={`/products/${product.id}`}>
                        <Image
                            src={
                                imageError
                                    ? '/placeholder-product.jpg'
                                    : product.imageUrl ||
                                      '/placeholder-product.jpg'
                            }
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    </Link>

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            -{discount}%
                        </Badge>
                    )}

                    {/* Wishlist Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                    >
                        <Heart
                            className={`h-4 w-4 ${
                                isWishlisted
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-gray-600'
                            }`}
                        />
                    </Button>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                    {/* Category */}
                    <Badge variant="secondary" className="text-xs">
                        {product.category.name}
                    </Badge>

                    {/* Product Name */}
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                        i < 4
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            (4.0)
                        </span>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-lg font-bold text-red-600">
                                {formatPrice(product.price)}
                            </span>
                            {product.originalPrice &&
                                product.originalPrice > product.price && (
                                    <span className="text-sm text-muted-foreground line-through ml-2">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                        </div>
                        <Link href={`/products/${product.id}`}>
                            <Button size="sm">
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Mua
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
