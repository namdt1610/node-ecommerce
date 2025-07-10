import { Layout } from '@/shared'
import { Product, Category } from '@/shared/types'
import { ProductsClientPage } from '@/features/products'
import { Metadata } from 'next'
import { Suspense } from 'react'

import { serverApi } from '@/lib/api/server'

// Server-side data fetching using reusable API services
async function getProductsAndCategories() {
    try {
        const [productsResponse, categoriesResponse] = await Promise.all([
            serverApi.products.getProducts(),
            serverApi.categories.getCategories(),
        ])

        return {
            products: productsResponse.success ? productsResponse.data as Product[] : [],
            categories: categoriesResponse.success
                ? categoriesResponse.data as Category[]
                : [],
        }
    } catch (error) {
        console.error('Failed to fetch data:', error)
        return {
            products: [],
            categories: [],
        }
    }
}

export const metadata: Metadata = {
    title: 'Products - ShopVite',
    description: 'Discover our wide range of quality products at great prices',
    openGraph: {
        title: 'Products - ShopVite',
        description:
            'Discover our wide range of quality products at great prices',
        type: 'website',
    },
}

export default async function ProductsPage() {
    const { products, categories } = await getProductsAndCategories()

    return (
        <Layout>
            <Suspense
                fallback={
                    <div className="flex justify-center items-center min-h-[400px]">
                        Loading products...
                    </div>
                }
            >
                <ProductsClientPage
                    initialProducts={products}
                    initialCategories={categories}
                />
            </Suspense>
        </Layout>
    )
}
