import api from './client'
import { ProductData } from '@/shared/types'

export const productApi = {
    getProducts: (params?: {
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

        return api.get(`/products?${searchParams.toString()}`)
    },
    getProduct: (id: string) => api.get(`/products/${id}`),
    createProduct: (data: ProductData) => api.post('/products', data),
    updateProduct: (id: string, data: Partial<ProductData>) =>
        api.put(`/products/${id}`, data),
    deleteProduct: (id: string) => api.delete(`/products/${id}`),
}
