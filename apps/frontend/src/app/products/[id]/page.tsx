import { Layout } from '@/shared'
import { Product } from '@/shared/types'
import { ProductTabs } from '@/features/products'
import ProductDetailClient from '@/features/products/components/product-detail-client'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { serverApi } from '@/lib/api/server'

// Server-side data fetching using reusable API service
async function getProduct(id: string): Promise<Product | null> {
    try {
        const response = await serverApi.products.getProduct(id)
        return response.success ? response.data as Product : null
    } catch (error) {
        console.error('Failed to fetch product:', error)
        return null
    }
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const resolvedParams = await params
    const product = await getProduct(resolvedParams.id)

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.',
        }
    }

    return {
        title: `${product.name} - ShopVite`,
        description:
            product.description ||
            `Buy ${product.name} at the best price on ShopVite`,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.imageUrl ? [product.imageUrl] : [],
            type: 'website',
        },
    }
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params
    const product = await getProduct(resolvedParams.id)

    if (!product) {
        notFound()
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <ProductDetailClient product={product} />
                <ProductTabs product={product} />
            </div>
        </Layout>
    )
}
