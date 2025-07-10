import { Layout, logger } from '@/shared'
import { Product, Category } from '@/shared/types'
import {
    HeroSection,
    CategoriesSection,
    ProductsSection,
} from '@/features/home'
import { serverApi } from '@/lib/api/server'

// Server-side data fetching using reusable API services
async function getProductsAndCategories() {
    try {
        const [productsResponse, categoriesResponse] = await Promise.all([
            serverApi.products.getProducts({ limit: 8 }),
            serverApi.categories.getCategories(),
        ])

        const products = productsResponse.success
            ? (productsResponse.data as Product[])
            : []
        const categories = categoriesResponse.success
            ? (categoriesResponse.data as Category[])
            : []

        logger.product.fetchSuccess(products.length, {
            categories: categories.length,
        })

        return {
            products,
            categories,
        }
    } catch (error) {
        logger.product.fetchError(error)
        return {
            products: [],
            categories: [],
        }
    }
}

export default async function Home() {
    const { products, categories } = await getProductsAndCategories()

    return (
        <Layout>
            <HeroSection />
            <CategoriesSection categories={categories} isLoading={false} />
            <ProductsSection products={products} isLoading={false} />
        </Layout>
    )
}
