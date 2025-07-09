import { ICartRepository } from '../../domain/interfaces/cart-repository.interface'
import { CartItemNotFoundError } from '../../domain/errors/cart-errors'

export class RemoveFromCartUseCase {
    constructor(private cartRepository: ICartRepository) {}

    async execute(userId: string, itemId: string): Promise<void> {
        // Verify item exists and belongs to user
        const cartItem = await this.cartRepository.findCartItem(userId, itemId)
        if (!cartItem) {
            throw new CartItemNotFoundError(itemId)
        }

        await this.cartRepository.removeItem(itemId)
    }
}
