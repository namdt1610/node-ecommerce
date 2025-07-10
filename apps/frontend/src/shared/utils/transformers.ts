// =================================
// DATA TRANSFORMERS
// =================================
// Functions to transform data between backend and frontend formats

import { StandardApiResponse, BackendOrder, Order } from '../types'

/**
 * Transform backend order to frontend order format
 * Handles the common pattern found in hooks/use-orders.ts
 */
export const transformBackendOrder = (backendOrder: BackendOrder): Order => {
    return {
        id: backendOrder.id,
        userId: backendOrder.userId,
        status: backendOrder.status,
        total: backendOrder.total,
        createdAt: backendOrder.createdAt,
        updatedAt: backendOrder.updatedAt,
        items:
            backendOrder.items?.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.unitPrice || item.price,
                product: {
                    id: item.productId,
                    name: item.productName,
                },
            })) || [],
    }
}

/**
 * Handle standard API response format
 * Extracts data from { success: boolean, data: T } wrapper
 */
export const extractApiData = <T>(response: StandardApiResponse<T>): T => {
    if (response && response.success && response.data) {
        return response.data
    }
    throw new Error(response?.error || 'API response format is invalid')
}

/**
 * Handle axios response wrapper
 * Common pattern: axios response -> { data: { success: boolean, data: T } }
 */
export const extractAxiosData = <T>(axiosResponse: {
    data: StandardApiResponse<T>
}): T => {
    return extractApiData(axiosResponse.data)
}

/**
 * Transform order list response
 */
export const transformOrderList = (response: {
    data: StandardApiResponse<BackendOrder[]>
}): Order[] => {
    try {
        const apiResponse = response.data
        if (
            apiResponse &&
            apiResponse.success &&
            Array.isArray(apiResponse.data)
        ) {
            return apiResponse.data.map(transformBackendOrder)
        }
        console.warn('Unexpected orders API response structure:', apiResponse)
        return []
    } catch (error) {
        console.error('Error transforming order list:', error)
        return []
    }
}

/**
 * Transform single order response
 */
export const transformOrderResponse = (response: {
    data: StandardApiResponse<BackendOrder>
}): Order | null => {
    try {
        const apiResponse = response.data
        if (apiResponse && apiResponse.success && apiResponse.data) {
            return transformBackendOrder(apiResponse.data)
        }
        console.warn('Unexpected order API response structure:', apiResponse)
        return null
    } catch (error) {
        console.error('Error transforming order:', error)
        return null
    }
}
