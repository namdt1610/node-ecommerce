import { useQuery } from '@tanstack/react-query'
import { productApi } from '@/lib/api'

export const useProducts = (params?: {
    category?: string
    search?: string
    sort?: string
    limit?: number
    page?: number
}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productApi.getProducts(params),
        select: (data) => data.data,
    })
}

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProduct(id),
        select: (data) => data.data,
        enabled: !!id,
    })
}

export const useProductSearch = (query: string) => {
    return useQuery({
        queryKey: ['products', 'search', query],
        queryFn: () => productApi.getProducts({ search: query }),
        select: (data) => data.data,
        enabled: !!query.trim(),
    })
}
