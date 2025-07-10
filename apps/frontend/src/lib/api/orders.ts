import api from './client'
import { CreateOrderRequest } from '@/shared/types'

export const orderApi = {
    getOrders: () => api.get('/orders'),
    getOrder: (id: string) => api.get(`/orders/${id}`),
    createOrder: (data: CreateOrderRequest) => api.post('/orders', data),
    updateOrderStatus: (id: string, status: string) =>
        api.put(`/orders/${id}/status`, { status }),

    // Order tracking endpoints
    getOrderTracking: (orderId: string) =>
        api.get(`/orders/tracking/${orderId}`),
    startOrderTracking: (orderId: string) =>
        api.post(`/orders/tracking/${orderId}/start`),
    joinOrderTracking: (orderId: string) =>
        api.post(`/orders/tracking/${orderId}/join`),
}
