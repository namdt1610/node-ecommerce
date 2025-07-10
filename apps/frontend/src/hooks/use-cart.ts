import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/lib/api/cart'
import { AxiosResponse } from 'axios'

// Cart hooks
export const useCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            try {
                console.log('Fetching cart data...')
                const response = await cartApi.getCart()
                console.log('Cart API response:', response)
                return response
            } catch (error) {
                console.error('Cart fetch error:', error)
                throw error
            }
        },
        // Backend returns Axios response, extract data.data
        select: (response: AxiosResponse) => {
            console.log('Axios response:', response)
            console.log('Cart data:', response.data)
            return response.data
        },
        retry: 2,
        staleTime: 0, // No cache for debugging
        gcTime: 0, // No cache for debugging
    })
}

export const useAddToCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            productId,
            quantity,
        }: {
            productId: string
            quantity: number
        }) => cartApi.addToCart(productId, quantity),
        onSuccess: (data) => {
            console.log('Add to cart successful:', data)
            // Invalidate cart queries to refetch
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (error) => {
            console.error('Add to cart failed:', error)
        },
    })
}

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            itemId,
            quantity,
        }: {
            itemId: string
            quantity: number
        }) => cartApi.updateCartItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (itemId: string) => cartApi.removeFromCart(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useClearCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => cartApi.clearCart(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}
