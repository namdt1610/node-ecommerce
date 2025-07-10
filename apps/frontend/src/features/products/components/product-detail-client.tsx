'use client'

import { ProductImages, ProductInfo } from '@/features/products'
import { useAddToCart } from '@/hooks/use-cart'
import { Product } from '@/shared/types'
import { useToast } from '@/shared'

interface ProductDetailClientProps {
    product: Product
}

export default function ProductDetailClient({
    product,
}: ProductDetailClientProps) {
    const addToCartMutation = useAddToCart()
    const { success, error } = useToast()

    const handleAddToCart = (quantity: number) => {
        addToCartMutation.mutate(
            {
                productId: product.id,
                quantity,
            },
            {
                onSuccess: () => {
                    success.addToCart(product.name)
                },
                onError: (err) => {
                    console.error('Failed to add product to cart:', err)
                    error.addToCart()
                },
            }
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProductImages productName={product.name} />
            <ProductInfo
                product={product}
                onAddToCart={handleAddToCart}
                addToCartLoading={addToCartMutation.isPending}
            />
        </div>
    )
}
