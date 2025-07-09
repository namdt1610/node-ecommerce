import { Layout } from '@/shared'
import { ProductTabs } from '@/features/products'
import ProductDetailClient from '@/features/products/components/product-detail-client'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Server-side data fetching
async function getProduct(id: string) {
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api'

    try {
        const response = await fetch(`${apiUrl}/products/${id}`, {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
        })

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        return data.success ? data.data : null
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
