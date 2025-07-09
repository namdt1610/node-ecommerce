"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCartRepository = void 0;
class PrismaCartRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUserId(userId) {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: true,
            },
        });
        if (cartItems.length === 0) {
            return null;
        }
        return this.mapToCart(userId, cartItems);
    }
    async findCartItem(userId, productId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
            include: {
                product: true,
            },
        });
        return cartItem ? this.mapToCartItem(cartItem) : null;
    }
    async addItem(data) {
        const product = await this.prisma.product.findUnique({
            where: { id: data.productId },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        const cartItem = await this.prisma.cartItem.create({
            data: {
                userId: data.userId,
                productId: data.productId,
                quantity: data.quantity,
            },
            include: {
                product: true,
            },
        });
        return this.mapToCartItem(cartItem);
    }
    async updateItem(itemId, data) {
        const cartItem = await this.prisma.cartItem.update({
            where: { id: itemId },
            data: {
                quantity: data.quantity,
            },
            include: {
                product: true,
            },
        });
        return this.mapToCartItem(cartItem);
    }
    async removeItem(itemId) {
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }
    async clearCart(userId) {
        await this.prisma.cartItem.deleteMany({
            where: { userId },
        });
    }
    async getCartItemsCount(userId) {
        const result = await this.prisma.cartItem.aggregate({
            where: { userId },
            _sum: {
                quantity: true,
            },
        });
        return result._sum.quantity || 0;
    }
    mapToCart(userId, cartItems) {
        const items = cartItems.map(this.mapToCartItem);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
        return {
            id: `cart_${userId}`, // Generate a cart ID
            userId,
            items,
            totalItems,
            totalAmount,
            finalAmount: totalAmount, // For now, same as totalAmount
            currency: 'VND',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    mapToCartItem(cartItem) {
        return {
            id: cartItem.id,
            cartId: `cart_${cartItem.userId}`, // Generate cartId from userId
            productId: cartItem.productId,
            product: cartItem.product,
            quantity: cartItem.quantity,
            unitPrice: cartItem.product.price,
            totalPrice: cartItem.quantity * cartItem.product.price,
            addedAt: cartItem.createdAt,
            updatedAt: cartItem.updatedAt,
        };
    }
}
exports.PrismaCartRepository = PrismaCartRepository;
