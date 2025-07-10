"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaOrderRepository = void 0;
const order_entity_1 = require("../../domain/entities/order.entity");
const database_1 = __importDefault(require("@/config/database"));
class PrismaOrderRepository {
    db;
    constructor() {
        this.db = database_1.default;
    }
    async create(data) {
        const order = await this.db.$transaction(async (tx) => {
            const productIds = data.items.map((i) => i.productId);
            const products = await tx.product.findMany({
                where: {
                    id: { in: productIds },
                },
                select: {
                    id: true,
                    inventory: true,
                    name: true,
                    price: true,
                },
            });
            // 1. Check tồn kho
            for (const item of data.items) {
                const product = products.find((p) => p.id === item.productId);
                if (!product) {
                    throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
                }
                const inventory = product.inventory;
                if (typeof inventory?.availableQuantity !== 'number' ||
                    inventory?.availableQuantity < item.quantity) {
                    throw new Error(`Sản phẩm ${product.name} không đủ hàng`);
                }
            }
            // 2. Trừ tồn kho
            await Promise.all(data.items.map((item) => tx.product.update({
                where: { id: item.productId },
                data: {
                    inventory: { decrement: item.quantity },
                },
            })));
            const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const order = await this.db.order.create({
                data: {
                    user: { connect: { id: data.userId } },
                    total,
                    status: 'PENDING',
                    orderItems: {
                        create: data.items.map((item) => ({
                            product: { connect: { id: item.productId } },
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: true,
                },
            });
        });
        return this.mapToOrder(order, data);
    }
    async findById(id) {
        const order = await this.db.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
        return order ? this.mapToOrder(order) : null;
    }
    async findByUserId(userId, params) {
        const { skip, take } = params || {};
        const orders = await this.db.order.findMany({
            where: { userId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
        return orders.map((order) => this.mapToOrder(order));
    }
    async update(id, data) {
        const order = await this.db.order.update({
            where: { id },
            data: {
                status: data.status,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
        return this.mapToOrder(order);
    }
    async delete(id) {
        await this.db.order.delete({
            where: { id },
        });
    }
    async count(userId) {
        return this.db.order.count({
            where: userId ? { userId } : undefined,
        });
    }
    mapToOrder(prismaOrder, createData) {
        return {
            id: prismaOrder.id,
            userId: prismaOrder.userId,
            orderNumber: prismaOrder.orderNumber || `ORDER-${prismaOrder.id.slice(-8)}`,
            status: prismaOrder.status,
            paymentStatus: order_entity_1.PaymentStatus.PENDING,
            shippingStatus: order_entity_1.ShippingStatus.NOT_SHIPPED,
            items: prismaOrder.orderItems?.map((item) => ({
                id: item.id,
                orderId: item.orderId,
                productId: item.productId,
                productName: item.product?.name || '',
                productImage: item.product?.imageUrl || '',
                productSku: item.product?.sku || '',
                model: item.product?.model || '',
                storage: '',
                color: '',
                unitPrice: item.price,
                quantity: item.quantity,
                totalPrice: item.price * item.quantity,
            })) || [],
            subtotal: prismaOrder.total || 0,
            tax: 0,
            shipping: 0,
            discount: 0,
            total: prismaOrder.total || 0,
            currency: 'VND',
            shippingAddress: {
                fullName: '',
                phone: '',
                street: createData?.shippingAddress || '',
                city: '',
                state: '',
                zipCode: '',
                country: 'VN',
            },
            billingAddress: {
                fullName: '',
                phone: '',
                street: createData?.shippingAddress || '',
                city: '',
                state: '',
                zipCode: '',
                country: 'VN',
            },
            paymentMethod: {
                type: createData?.paymentMethod || 'cod',
                provider: 'manual',
            },
            createdAt: prismaOrder.createdAt,
            updatedAt: prismaOrder.updatedAt,
        };
    }
}
exports.PrismaOrderRepository = PrismaOrderRepository;
