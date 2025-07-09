import { Layout } from '@/shared'
import { ProductsClientPage } from '@/features/products'
import { Metadata } from 'next'

// Server-side data fetching
async function getProductsAndCategories() {
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api'

    try {
        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`${apiUrl}/products`, {
                next: { revalidate: 300 }, // Revalidate every 5 minutes
            }),
            fetch(`${apiUrl}/categories`, {
                next: { revalidate: 600 }, // Revalidate every 10 minutes
            }),
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        return {
            products: productsData.success ? productsData.data : [],
            categories: categoriesData.success ? categoriesData.data : [],
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
            <ProductsClientPage
                initialProducts={products}
                initialCategories={categories}
            />
        </Layout>
    )
}
