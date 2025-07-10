'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import Link from 'next/link'

import { Product } from '@/shared/types'
import { useAddToCart } from '@/hooks/use-cart'
import {
    useToast,
    ProductImageFill,
    getProductImageUrl,
    logger,
} from '@/shared'

interface ProductsSectionProps {
    products: Product[]
    isLoading: boolean
}

export function ProductsSection({ products, isLoading }: ProductsSectionProps) {
    const addToCartMutation = useAddToCart()
    const { success, error } = useToast()

    const handleAddToCart = (productId: string, productName: string) => {
        addToCartMutation.mutate(
            { productId, quantity: 1 },
            {
                onSuccess: () => {
                    success.addToCart(productName)
                },
                onError: (err) => {
                    logger.cart.addItemError(err, productId)
                    error.addToCart()
                },
            }
        )
    }

    const renderProductCard = (product: Product) => {
        const hasDiscount =
            product.originalPrice && product.originalPrice > product.price
        const discountPercent = hasDiscount
            ? Math.round(
                  ((product.originalPrice! - product.price) /
                      product.originalPrice!) *
                      100
              )
            : 0

        return (
            <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow"
            >
                <CardContent className="p-0">
                    <div className="aspect-square bg-gray-200 relative overflow-hidden">
                        {hasDiscount && (
                            <Badge className="absolute top-2 left-2 bg-red-500 z-10">
                                -{discountPercent}%
                            </Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white z-10"
                        >
                            <Heart className="h-4 w-4" />
                        </Button>
                        <ProductImageFill
                            src={getProductImageUrl(product)}
                            alt={product.name}
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                    </div>
                    <div className="p-4">
                        <Link href={`/products/${product.id}`}>
                            <h4 className="font-semibold mb-2 hover:text-primary cursor-pointer line-clamp-2 min-h-[3rem]">
                                {product.name}
                            </h4>
                        </Link>
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
                            <div className="flex-1">
                                <span className="text-lg font-bold text-red-600">
                                    ₫{product.price?.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className="text-sm text-muted-foreground line-through ml-2 block">
                                        ₫
                                        {product.originalPrice?.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <Button
                                size="sm"
                                onClick={() =>
                                    handleAddToCart(product.id, product.name)
                                }
                                disabled={addToCartMutation.isPending}
                            >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                {addToCartMutation.isPending
                                    ? 'Đang thêm...'
                                    : 'Mua'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const renderFallbackProduct = (index: number) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 relative">
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
                    <h4 className="font-semibold mb-2">Sản phẩm {index + 1}</h4>
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
                                ₫{(199000 + index * 50000).toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground line-through ml-2">
                                ₫{(249000 + index * 50000).toLocaleString()}
                            </span>
                        </div>
                        <Button size="sm">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Mua
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center mb-12">
                    Sản phẩm nổi bật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading
                        ? // Loading skeleton
                          Array.from({ length: 8 }).map((_, i) => (
                              <Card key={i} className="animate-pulse">
                                  <CardContent className="p-0">
                                      <div className="aspect-square bg-gray-200" />
                                      <div className="p-4 space-y-2">
                                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                                          <div className="h-6 bg-gray-200 rounded w-full" />
                                      </div>
                                  </CardContent>
                              </Card>
                          ))
                        : products && products.length > 0
                          ? products.map(renderProductCard)
                          : Array.from({ length: 8 }).map((_, i) =>
                                renderFallbackProduct(i)
                            )}
                </div>

                <div className="text-center mt-8">
                    <Link href="/products">
                        <Button variant="outline" size="lg">
                            Xem tất cả sản phẩm
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
