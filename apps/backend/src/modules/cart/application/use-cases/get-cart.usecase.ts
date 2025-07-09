import { ICartRepository } from '../../domain/interfaces/cart-repository.interface'
import { Cart } from '../../domain/entities/cart.entity'

export class GetCartUseCase {
    constructor(private cartRepository: ICartRepository) {}

    async execute(userId: string): Promise<Cart | null> {
        return await this.cartRepository.findByUserId(userId)
    }
}
