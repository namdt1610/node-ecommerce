"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCartItemUseCase = void 0;
const cart_dto_1 = require("../dto/cart.dto");
const cart_errors_1 = require("../../domain/errors/cart-errors");
const product_errors_1 = require("../../../product/domain/errors/product-errors");
class UpdateCartItemUseCase {
    cartRepository;
    productRepository;
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async execute(userId, itemId, dto) {
        // Validate input
        const validatedDto = cart_dto_1.UpdateCartItemSchema.parse(dto);
        // Get the user's cart first to find the item
        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            throw new cart_errors_1.CartErrors.CartItemNotFoundError(itemId);
        }
        // Find the specific cart item
        const cartItem = cart.items.find(item => item.id === itemId);
        if (!cartItem) {
            throw new cart_errors_1.CartErrors.CartItemNotFoundError(itemId);
        }
        // Check product availability
        const product = await this.productRepository.findById(cartItem.productId);
        if (!product) {
            throw new product_errors_1.ProductErrors.ProductNotFoundError(cartItem.productId);
        }
        if (!product.isActive) {
            throw new product_errors_1.ProductErrors.ProductNotAvailableError('Product is no longer available');
        }
        // Check inventory availability
        const availableQuantity = await this.productRepository.getAvailableQuantity(cartItem.productId);
        if (availableQuantity < validatedDto.quantity) {
            throw new cart_errors_1.CartErrors.InsufficientStockError(`Only ${availableQuantity} items available`);
        }
        // Update cart item
        return await this.cartRepository.updateItem(itemId, validatedDto);
    }
}
exports.UpdateCartItemUseCase = UpdateCartItemUseCase;
