'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product, Category, SortOption } from '@/shared/types'

export function useProductsPage(limit = 12) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000])
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [showFilters, setShowFilters] = useState<boolean>(false)

    useEffect(() => {
        const urlCategory = searchParams.get('category') || 'all'
        setSelectedCategory(urlCategory)
        setPage(1)
    }, [searchParams])

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const categoryParam =
                selectedCategory !== 'all'
                    ? `&category=${selectedCategory}`
                    : ''
            const [productsResponse, categoriesResponse] = await Promise.all([
                fetch(
                    `http://localhost:3030/api/products?page=${page}&limit=${limit}${categoryParam}`
                ),
                fetch('http://localhost:3030/api/categories'),
            ])
            if (!productsResponse.ok || !categoriesResponse.ok)
                throw new Error('Failed to fetch data')
            const [productsData, categoriesData] = await Promise.all([
                productsResponse.json(),
                categoriesResponse.json(),
            ])
            if (productsData.success && Array.isArray(productsData.data)) {
                setAllProducts(productsData.data as Product[])
                
                // Handle both pagination and meta response structures
                const meta = productsData.meta || productsData.pagination
                const total = meta?.total || 0
                const currentLimit = meta?.limit || limit
                const calculatedTotalPages = Math.ceil(total / currentLimit)
                
                // Debug pagination data
                console.log('Products API Response:', {
                    dataLength: productsData.data.length,
                    meta: meta,
                    total: total,
                    currentLimit: currentLimit,
                    calculatedTotalPages: calculatedTotalPages,
                    currentPage: page
                })
                
                setTotalPages(calculatedTotalPages || 1)
                const prices = (productsData.data as Product[]).map(
                    (p: Product) => p.price
                )
                if (prices.length > 0)
                    setPriceRange([Math.min(...prices), Math.max(...prices)])
            }
            if (categoriesData.success && Array.isArray(categoriesData.data))
                setCategories(categoriesData.data as Category[])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }, [page, selectedCategory, limit])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat)
        setPage(1)
        const params = new URLSearchParams(searchParams)
        if (cat === 'all') params.delete('category')
        else params.set('category', cat)
        router.replace(`?${params.toString()}`)
    }

    const filteredAndSortedProducts = useMemo(() => {
        let filtered: Product[] = allProducts
        if (searchTerm) {
            filtered = filtered.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.category.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            )
        }
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(
                (product) => product.category.id === selectedCategory
            )
        }
        filtered = filtered.filter(
            (product) =>
                product.price >= priceRange[0] && product.price <= priceRange[1]
        )
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name)
                case 'name-desc':
                    return b.name.localeCompare(a.name)
                case 'price-asc':
                    return a.price - b.price
                case 'price-desc':
                    return b.price - a.price
                case 'newest':
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                case 'oldest':
                    return (
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    )
                default:
                    return 0
            }
        })
        return sorted
    }, [allProducts, searchTerm, selectedCategory, priceRange, sortBy])

    const handleImageError = (productId: string) => {
        setImageErrors((prev) => new Set(prev).add(productId))
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price)

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedCategory('all')
        const prices = allProducts.map((p) => p.price)
        setPriceRange([Math.min(...prices), Math.max(...prices)])
        setSortBy('newest')
    }

    return {
        allProducts,
        categories,
        loading,
        error,
        imageErrors,
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
        handleImageError,
        formatPrice,
        clearFilters,
    }
}
