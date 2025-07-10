import { useQuery } from '@tanstack/react-query'
import { productApi } from '@/lib/api/products'

// Product hooks
export const useProducts = (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productApi.getProducts(params),
        select: (response) => response.data, // Return the full API response structure
    })
}

export const useProduct = (id: string) => {
    console.log('useProduct called with id:', id)

    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            console.log('useProduct queryFn called with id:', id)
            console.log(
                'Making API call to:',
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api'}/products/${id}`
            )
            try {
                const response = await productApi.getProduct(id)
                console.log('API response received:', response)
                console.log('Response data:', response.data)
                console.log('Response status:', response.status)
                return response
            } catch (error) {
                console.error('API error in queryFn:', error)
                if (error instanceof Error) {
                    console.error('Error message:', error.message)
                }
                if (error && typeof error === 'object' && 'response' in error) {
                    console.error(
                        'Error response:',
                        (error as { response: unknown }).response
                    )
                }
                throw error
            }
        },
        select: (axiosResponse) => {
            console.log(
                'useProduct select called with axiosResponse:',
                axiosResponse
            )
            console.log('Axios response data:', axiosResponse.data)
            console.log('API success field:', axiosResponse.data.success)
            console.log('API data field:', axiosResponse.data.data)
            // The API returns { success: true, data: product } wrapped in axios response
            return axiosResponse.data.data
        },
        enabled: !!id,
        retry: 1,
        retryDelay: 1000,
    })
}
