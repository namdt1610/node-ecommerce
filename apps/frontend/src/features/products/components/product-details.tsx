'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Star, Heart, ShoppingCart, Minus, Plus } from 'lucide-react'
import { Product } from '@/shared/types'
import { formatPrice, calculateDiscount } from '@/shared/utils'
import Image from 'next/image'

interface ProductDetailsProps {
    product: Product
    onAddToCart?: (productId: string, quantity: number) => void
    onToggleWishlist?: (productId: string) => void
}

export function ProductDetails({
    product,
    onAddToCart,
    onToggleWishlist,
}: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1)
    const selectedVariant = product.variants?.[0] || null

    const handleQuantityChange = (delta: number) => {
        setQuantity(Math.max(1, quantity + delta))
    }

    const handleAddToCart = () => {
        onAddToCart?.(product.id, quantity)
    }

    const currentPrice = selectedVariant?.price || product.price
    const originalPrice =
        selectedVariant?.originalPrice || product.originalPrice
    const discount =
        originalPrice && currentPrice
            ? calculateDiscount(originalPrice, currentPrice)
            : 0

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    {product.images?.[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <span>Hình ảnh sản phẩm</span>
                        </div>
                    )}
                </div>

                {/* Thumbnail images */}
                {product.images && product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                        {product.images.map((image, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                            >
                                <Image
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                        i < 4
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            (4.0)
                        </span>
                        <span className="text-sm text-muted-foreground">
                            • 120 đánh giá
                        </span>
                    </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-red-600">
                            {formatPrice(currentPrice)}
                        </span>
                        {originalPrice && originalPrice > currentPrice && (
                            <>
                                <span className="text-lg text-gray-500 line-through">
                                    {formatPrice(originalPrice)}
                                </span>
                                <Badge variant="destructive">
                                    -{discount}%
                                </Badge>
                            </>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Product Description */}
                {product.description && (
                    <div>
                        <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
                        <p className="text-gray-600">{product.description}</p>
                    </div>
                )}

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-3">Tùy chọn</h3>
                        <div className="space-y-3">
                            {selectedVariant?.attributes.map((attr) => (
                                <div key={attr.name}>
                                    <span className="text-sm font-medium">
                                        {attr.name}:{' '}
                                    </span>
                                    <span className="text-sm">
                                        {attr.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Separator />

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold">Số lượng:</span>
                        <div className="flex items-center border rounded-lg">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center">
                                {quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => handleQuantityChange(1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            className="flex-1"
                            size="lg"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Thêm vào giỏ hàng
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => onToggleWishlist?.(product.id)}
                        >
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Additional Info */}
                <Card>
                    <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Danh mục:</span>
                            <span className="font-medium">
                                {product.category?.name}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tình trạng:</span>
                            <span className="font-medium text-green-600">
                                Còn hàng
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Giao hàng:</span>
                            <span className="font-medium">
                                2-3 ngày làm việc
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
