import { ICartRepository } from '../../domain/interfaces/cart-repository.interface'
import { AddToCartData, CartItem } from '../../domain/entities/cart.entity'

export class SimpleAddToCartUseCase {
    constructor(private cartRepository: ICartRepository) {}

    async execute(data: AddToCartData): Promise<CartItem> {
        // Check if item already exists in cart
        const existingItem = await this.cartRepository.findCartItem(
            data.userId,
            data.productId
        )

        if (existingItem) {
            // Update quantity if item already exists
            return this.cartRepository.updateItem(existingItem.id, {
                quantity: existingItem.quantity + data.quantity,
            })
        }

        // Add new item to cart
        return this.cartRepository.addItem(data)
    }
}
