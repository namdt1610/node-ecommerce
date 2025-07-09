import {
    Cart,
    CartItem,
    AddToCartData,
    UpdateCartItemData,
} from '../entities/cart.entity'

export interface ICartRepository {
    findByUserId(userId: string): Promise<Cart | null>
    findCartItem(userId: string, productId: string): Promise<CartItem | null>
    addItem(data: AddToCartData): Promise<CartItem>
    updateItem(itemId: string, data: UpdateCartItemData): Promise<CartItem>
    removeItem(itemId: string): Promise<void>
    clearCart(userId: string): Promise<void>
    getCartItemsCount(userId: string): Promise<number>
}
