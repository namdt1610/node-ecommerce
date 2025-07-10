import {
    PrismaClient,
    Order as PrismaOrder,
    OrderItem,
    Prisma,
} from '@prisma/client'
import { IOrderRepository } from '../../domain/interfaces/order-repository.interface'
import {
    Order,
    CreateOrderData,
    UpdateOrderData,
    PaymentStatus,
    ShippingStatus,
} from '../../domain/entities/order.entity'
import { ProductInventory } from '@/modules/product/domain/entities/product.entity'
import prisma from '@/config/database'

export class PrismaOrderRepository implements IOrderRepository {
    private db: PrismaClient

    constructor() {
        this.db = prisma
    }

    async create(data: CreateOrderData): Promise<Order> {
        const order = await this.db.$transaction(async (tx) => {
            const productIds = data.items.map((i) => i.productId)

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
            })

            // 1. Check tồn kho
            for (const item of data.items) {
                const product = products.find((p) => p.id === item.productId)
                if (!product) {
                    throw new Error(`Sản phẩm ${item.productId} không tồn tại`)
                }

                const inventory =
                    product.inventory as unknown as ProductInventory

                if (
                    typeof inventory?.availableQuantity !== 'number' ||
                    inventory?.availableQuantity < item.quantity
                ) {
                    throw new Error(`Sản phẩm ${product.name} không đủ hàng`)
                }
            }

            // 2. Trừ tồn kho
            await Promise.all(
                data.items.map((item) =>
                    tx.product.update({
                        where: { id: item.productId },
                        data: {
                            inventory: { decrement: item.quantity },
                        },
                    })
                )
            )

            const total = data.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            )

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
            })
        })

        return this.mapToOrder(order, data)
    }

    async findById(id: string): Promise<Order | null> {
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
        })

        return order ? this.mapToOrder(order) : null
    }

    async findByUserId(
        userId: string,
        params?: {
            skip?: number
            take?: number
        }
    ): Promise<Order[]> {
        const { skip, take } = params || {}
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
        })

        return orders.map((order) => this.mapToOrder(order))
    }

    async update(id: string, data: UpdateOrderData): Promise<Order> {
        const order = await this.db.order.update({
            where: { id },
            data: {
                status: data.status as any,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        })

        return this.mapToOrder(order)
    }

    async delete(id: string): Promise<void> {
        await this.db.order.delete({
            where: { id },
        })
    }

    async count(userId?: string): Promise<number> {
        return this.db.order.count({
            where: userId ? { userId } : undefined,
        })
    }

    private mapToOrder(prismaOrder: any, createData?: CreateOrderData): Order {
        return {
            id: prismaOrder.id,
            userId: prismaOrder.userId,
            orderNumber:
                prismaOrder.orderNumber || `ORDER-${prismaOrder.id.slice(-8)}`,
            status: prismaOrder.status,
            paymentStatus: PaymentStatus.PENDING,
            shippingStatus: ShippingStatus.NOT_SHIPPED,
            items:
                prismaOrder.orderItems?.map((item: any) => ({
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
        }
    }
}
