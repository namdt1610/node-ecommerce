/**
 * Server-side API utilities for Next.js server components
 * These functions use native fetch and can be used in server-side contexts
 * server-side fetching không thể sử dụng trực tiếp axios client vì nó chạy trên server
 */

// Get the API base URL
const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api'

/**
 * Generic server-side fetch wrapper
 */
async function serverFetch<T = unknown>(
    endpoint: string, 
    options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string }> {
    const url = `${getApiUrl()}${endpoint}`
    
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
}

/**
 * Server-side product API
 */
export const serverProductApi = {
    /**
     * Get products with optional parameters
     */
    getProducts: async (params?: {
        page?: number
        limit?: number
        category?: string
        search?: string
    }) => {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.append('page', params.page.toString())
        if (params?.limit) searchParams.append('limit', params.limit.toString())
        if (params?.category) searchParams.append('category', params.category)
        if (params?.search) searchParams.append('search', params.search)

        const query = searchParams.toString()
        return serverFetch(`/products${query ? `?${query}` : ''}`, {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
        })
    },

    /**
     * Get a single product by ID
     */
    getProduct: async (id: string) => {
        return serverFetch(`/products/${id}`, {
            next: { revalidate: 300 },
        })
    },
}

/**
 * Server-side category API
 */
export const serverCategoryApi = {
    /**
     * Get all categories
     */
    getCategories: async () => {
        return serverFetch('/categories', {
            next: { revalidate: 600 }, // Revalidate every 10 minutes
        })
    },

    /**
     * Get a single category by ID
     */
    getCategory: async (id: string) => {
        return serverFetch(`/categories/${id}`, {
            next: { revalidate: 600 },
        })
    },
}

/**
 * Server-side user API
 */
export const serverUserApi = {
    /**
     * Get user profile (requires authentication)
     */
    getProfile: async (token: string) => {
        return serverFetch('/auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    },
}

/**
 * Combined server API for convenience
 */
export const serverApi = {
    products: serverProductApi,
    categories: serverCategoryApi,
    users: serverUserApi,
} 