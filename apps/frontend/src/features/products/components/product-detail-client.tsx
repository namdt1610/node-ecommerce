'use client'

import { ProductImages, ProductInfo } from '@/features/products'
import { useAddToCart } from '@/hooks/use-api'
import { Product } from '@/shared/types'

interface ProductDetailClientProps {
    product: Product
}

export default function ProductDetailClient({
    product,
}: ProductDetailClientProps) {
    const addToCartMutation = useAddToCart()

    const handleAddToCart = (quantity: number) => {
        addToCartMutation.mutate({
            productId: product.id,
            quantity,
        })
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
