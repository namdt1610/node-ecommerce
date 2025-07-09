'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/shared/types'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const fallback =
                                    target.nextElementSibling as HTMLElement
                                if (fallback) fallback.style.display = 'flex'
                            }}
                        />
                    ) : null}
                    <div
                        className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-200"
                        style={{ display: product.imageUrl ? 'none' : 'flex' }}
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                                <ShoppingCart className="h-8 w-8 text-gray-400" />
                            </div>
                            <span className="text-sm">Hình ảnh sản phẩm</span>
                        </div>
                    </div>
                    <Badge className="absolute top-2 left-2 bg-red-500">
                        -20%
                    </Badge>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                        <h4 className="font-semibold mb-2 hover:text-primary cursor-pointer line-clamp-2">
                            {product.name}
                        </h4>
                    </Link>
                    {product.category && (
                        <p className="text-sm text-gray-500 mb-2">
                            {product.category.name}
                        </p>
                    )}
                    <div className="flex items-center mb-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                                key={j}
                                className={`h-4 w-4 ${
                                    j < 4
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                            (4.0)
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-lg font-bold text-red-600">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(product.price)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through ml-2">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(product.price * 1.25)}
                            </span>
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
