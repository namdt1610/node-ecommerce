"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
class OrderService {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async createOrder(createOrderDto) {
        const { userId, items } = createOrderDto;
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = (await this.orderRepository.create({
            user: { connect: { id: userId } },
            total,
            status: 'PENDING',
            orderItems: {
                create: items.map((item) => ({
                    product: { connect: { id: item.productId } },
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        }));
        return this.mapToResponseDto(order);
    }
    async getOrderById(id) {
        const order = (await this.orderRepository.findById(id));
        if (!order) {
            return null;
        }
        return this.mapToResponseDto(order);
    }
    async getAllOrders(params) {
        const { skip, take, userId, status } = params || {};
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        if (status) {
            where.status = status;
        }
        const orders = (await this.orderRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        }));
        return orders.map((order) => this.mapToResponseDto(order));
    }
    async updateOrder(id, updateOrderDto) {
        const order = (await this.orderRepository.update(id, updateOrderDto));
        return this.mapToResponseDto(order);
    }
    async deleteOrder(id) {
        await this.orderRepository.delete(id);
    }
    async getOrdersCount(params) {
        const { userId, status } = params || {};
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        if (status) {
            where.status = status;
        }
        return this.orderRepository.count(where);
    }
    mapToResponseDto(order) {
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            total: order.total,
            orderItems: order.orderItems.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                },
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
}
exports.OrderService = OrderService;
