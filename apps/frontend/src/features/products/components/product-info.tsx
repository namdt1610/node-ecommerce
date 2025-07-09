'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Star,
    ShoppingCart,
    Heart,
    Share,
    Minus,
    Plus,
    Truck,
    Shield,
    RotateCcw,
} from 'lucide-react'
import ProductVariants from './product-variants'
import { Product } from '@/shared/types'

interface ProductInfoProps {
    product: Product
    onAddToCart: (quantity: number) => void
    addToCartLoading: boolean
}

export default function ProductInfo({
    product,
    onAddToCart,
    addToCartLoading,
}: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1)

    const variants = product?.variants
        ? typeof product.variants === 'string'
            ? JSON.parse(product.variants)
            : product.variants
        : []

    const increaseQuantity = () => setQuantity((prev) => prev + 1)
    const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

    const handleAddToCart = () => {
        onAddToCart(quantity)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${
                                    i < 4
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                            (4.5) • 128 đánh giá
                        </span>
                    </div>
                    <Badge variant="outline">Còn hàng</Badge>
                </div>
            </div>

            <ProductVariants
                variants={variants}
                basePrice={product.price || 0}
                baseOriginalPrice={product.originalPrice}
            />

            {(!variants || variants.length === 0) && (
                <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <span className="text-3xl font-bold text-red-600">
                            ₫{product.price?.toLocaleString()}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                            ₫{((product.price || 0) * 1.25).toLocaleString()}
                        </span>
                        <Badge className="bg-red-500">-20%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Đã bao gồm VAT
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <span className="font-medium">Số lượng:</span>
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(
                                    Math.max(1, parseInt(e.target.value) || 1)
                                )
                            }
                            className="w-20 text-center mx-2"
                            min="1"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={increaseQuantity}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <Button
                        className="flex-1"
                        onClick={handleAddToCart}
                        disabled={addToCartLoading}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {addToCartLoading
                            ? 'Đang thêm...'
                            : 'Thêm vào giỏ hàng'}
                    </Button>
                    <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Share className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Bảo hành 12 tháng</span>
                </div>
                <div className="flex items-center space-x-2">
                    <RotateCcw className="h-5 w-5 text-orange-600" />
                    <span className="text-sm">Đổi trả 30 ngày</span>
                </div>
            </div>
        </div>
    )
}
