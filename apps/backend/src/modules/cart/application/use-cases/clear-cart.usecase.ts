import { ICartRepository } from '../../domain/interfaces/cart-repository.interface'

export class ClearCartUseCase {
    constructor(private cartRepository: ICartRepository) {}

    async execute(userId: string): Promise<void> {
        await this.cartRepository.clearCart(userId)
    }
}
