import { Layout } from '@/shared'
import {
    HeroSection,
    CategoriesSection,
    ProductsSection,
    Footer,
} from '@/features/home'

// Server-side data fetching
async function getProductsAndCategories() {
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api'

    try {
        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`${apiUrl}/products?limit=8`, {
                next: { revalidate: 300 }, // Revalidate every 5 minutes
            }),
            fetch(`${apiUrl}/categories`, {
                next: { revalidate: 600 }, // Revalidate every 10 minutes
            }),
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        const products = productsData.success ? productsData.data : []
        const categories = categoriesData.success ? categoriesData.data : []
        
        console.log(`Fetched ${products.length} products and ${categories.length} categories for home page`)
        
        return {
            products,
            categories,
        }
    } catch (error) {
        console.error('Failed to fetch data:', error)
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
            <CategoriesSection 
                categories={categories} 
                isLoading={false} 
            />
            <ProductsSection 
                products={products} 
                isLoading={false} 
            />
            <Footer />
        </Layout>
    )
}
