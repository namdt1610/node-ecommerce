import api from './client'

export const cartApi = {
    getCart: () => api.get('/cart'),
    addToCart: (productId: string, quantity: number) =>
        api.post('/cart/add', { productId, quantity }),
    updateCartItem: (itemId: string, quantity: number) =>
        api.put(`/cart/items/${itemId}`, { quantity }),
    removeFromCart: (itemId: string) => api.delete(`/cart/items/${itemId}`),
    clearCart: () => api.delete('/cart'),
}
