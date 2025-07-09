import { PrismaClient, Order, OrderItem, Prisma } from '@prisma/client'
import prisma from '../../config/database'

export class OrderRepository {
    private db: PrismaClient

    constructor() {
        this.db = prisma
    }

    async create(data: Prisma.OrderCreateInput): Promise<Order> {
        return this.db.order.create({
            data,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        })
    }

    async findById(id: string): Promise<Order | null> {
        return this.db.order.findUnique({
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
    }

    async findAll(params?: {
        skip?: number
        take?: number
        orderBy?: Prisma.OrderOrderByWithRelationInput
        where?: Prisma.OrderWhereInput
    }): Promise<Order[]> {
        const { skip, take, orderBy, where } = params || {}
        return this.db.order.findMany({
            skip,
            take,
            orderBy,
            where,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        })
    }

    async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
        return this.db.order.update({
            where: { id },
            data,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        })
    }

    async delete(id: string): Promise<Order> {
        return this.db.order.delete({
            where: { id },
        })
    }

    async count(where?: Prisma.OrderWhereInput): Promise<number> {
        return this.db.order.count({ where })
    }
}
