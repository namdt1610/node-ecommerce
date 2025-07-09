import { IProductRepository } from '../../../product/domain/interfaces/product-repository.interface'
import { ICartRepository } from '../../domain/interfaces/cart-repository.interface'
import { AddToCartDto, AddToCartSchema } from '../dto/cart.dto'
import { CartItem } from '../../domain/entities/cart.entity'
import { CartErrors } from '../../domain/errors/cart-errors'
import { ProductErrors } from '../../../product/domain/errors/product-errors'

export class AddToCartUseCase {
    constructor(
        private cartRepository: ICartRepository,
        private productRepository: IProductRepository
    ) {}

    async execute(userId: string, dto: AddToCartDto): Promise<CartItem> {
        // Validate input
        const validatedDto = AddToCartSchema.parse(dto)

        // Check if product exists and is available
        const product = await this.productRepository.findById(
            validatedDto.productId
        )
        if (!product) {
            throw new ProductErrors.ProductNotFoundError(dto.productId)
        }

        if (!product.isActive) {
            throw new ProductErrors.ProductNotAvailableError(
                'Product is not available'
            )
        }

        // Check inventory availability
        const availableQuantity =
            await this.productRepository.getAvailableQuantity(
                validatedDto.productId
            )
        if (availableQuantity < validatedDto.quantity) {
            throw new CartErrors.InsufficientStockError(
                `Only ${availableQuantity} items available`
            )
        }

        // Check if item already exists in cart (no variants support for now)
        const existingItem = await this.cartRepository.findCartItem(
            userId,
            validatedDto.productId
        )

        if (existingItem) {
            // Update existing item quantity
            const newQuantity = existingItem.quantity + validatedDto.quantity

            // Check total quantity availability
            if (availableQuantity < newQuantity) {
                throw new CartErrors.InsufficientStockError(
                    `Only ${availableQuantity} items available`
                )
            }

            return await this.cartRepository.updateItem(existingItem.id, {
                quantity: newQuantity,
            })
        } else {
            // Add new item to cart
            return await this.cartRepository.addItem({
                userId,
                productId: validatedDto.productId,
                quantity: validatedDto.quantity,
            })
        }
    }
}
