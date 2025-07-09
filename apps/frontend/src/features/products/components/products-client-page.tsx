'use client'

import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import { ProductGrid, ProductFilters } from '@/features/products'
import { PaginationControls } from '@/shared'
import { useProductsPage } from '@/features/products'
import { Product, Category } from '@/shared/types'

interface ProductsClientPageProps {
    initialProducts: Product[]
    initialCategories: Category[]
}

export default function ProductsClientPage({
    initialProducts,
    initialCategories,
}: ProductsClientPageProps) {
    const {
        allProducts,
        categories,
        loading,
        error,
        page,
        setPage,
        totalPages,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        handleCategoryChange,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        showFilters,
        setShowFilters,
        filteredAndSortedProducts,
        clearFilters,
    } = useProductsPage(12)

    // Use initial data if still loading
    const products = loading ? initialProducts : allProducts
    const cats = loading ? initialCategories : categories

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="text-center max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Có lỗi xảy ra
                    </h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Thử lại
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                        Đảm bảo backend server đang chạy trên port 3030
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Bộ lọc
                    </Button>
                    <p className="text-gray-600">{products.length} sản phẩm</p>
                </div>
            </div>

            {showFilters && (
                <ProductFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={handleCategoryChange}
                    categories={cats}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    allProducts={products}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    clearFilters={clearFilters}
                />
            )}

            <ProductGrid
                products={
                    filteredAndSortedProducts.length > 0
                        ? filteredAndSortedProducts
                        : products
                }
            />

            <PaginationControls
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />
        </div>
    )
}
