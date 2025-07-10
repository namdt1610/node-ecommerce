import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '@/lib/api/orders'
import {
    transformOrderList,
    transformOrderResponse,
    createRetryConfig,
    createQueryKey,
} from '@/shared/utils'

// Order hooks using centralized helpers
export const useOrder = (id: string) => {
    return useQuery({
        queryKey: createQueryKey('order', id),
        queryFn: () => orderApi.getOrder(id),
        select: transformOrderResponse,
        enabled: !!id,
        ...createRetryConfig(),
    })
}

export const useOrders = () => {
    return useQuery({
        queryKey: createQueryKey('orders'),
        queryFn: async () => {
            try {
                const response = await orderApi.getOrders()
                return response
            } catch (error) {
                console.error('Orders API error:', error)
                throw error
            }
        },
        select: transformOrderList,
        ...createRetryConfig(),
    })
}

export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: orderApi.createOrder,
        onSuccess: () => {
            // Invalidate and refetch orders
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
    })
}
