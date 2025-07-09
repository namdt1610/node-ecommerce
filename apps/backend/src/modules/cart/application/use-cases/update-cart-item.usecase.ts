import { IProductRepository } from '../../../product/domain/interfaces/product-repository.interface'
import { ICartRepository } from '../../domain/interfaces/cart-repository.interface'
import { UpdateCartItemDto, UpdateCartItemSchema } from '../dto/cart.dto'
import { CartItem } from '../../domain/entities/cart.entity'
import { CartErrors } from '../../domain/errors/cart-errors'
import { ProductErrors } from '../../../product/domain/errors/product-errors'

export class UpdateCartItemUseCase {
    constructor(
        private cartRepository: ICartRepository,
        private productRepository: IProductRepository
    ) {}

    async execute(
        userId: string,
        itemId: string,
        dto: UpdateCartItemDto
    ): Promise<CartItem> {
        // Validate input
        const validatedDto = UpdateCartItemSchema.parse(dto)

        // Get the user's cart first to find the item
        const cart = await this.cartRepository.findByUserId(userId)
        if (!cart) {
            throw new CartErrors.CartItemNotFoundError(itemId)
        }

        // Find the specific cart item
        const cartItem = cart.items.find(item => item.id === itemId)
        if (!cartItem) {
            throw new CartErrors.CartItemNotFoundError(itemId)
        }

        // Check product availability
        const product = await this.productRepository.findById(
            cartItem.productId
        )
        if (!product) {
            throw new ProductErrors.ProductNotFoundError(cartItem.productId)
        }

        if (!product.isActive) {
            throw new ProductErrors.ProductNotAvailableError(
                'Product is no longer available'
            )
        }

        // Check inventory availability
        const availableQuantity =
            await this.productRepository.getAvailableQuantity(
                cartItem.productId
            )
        if (availableQuantity < validatedDto.quantity) {
            throw new CartErrors.InsufficientStockError(
                `Only ${availableQuantity} items available`
            )
        }

        // Update cart item
        return await this.cartRepository.updateItem(itemId, validatedDto)
    }
}
