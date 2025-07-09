import { PrismaClient, Product, Prisma } from '@prisma/client'
import prisma from '../../config/database'

export class ProductRepository {
    private db: PrismaClient

    constructor() {
        this.db = prisma
    }

    async create(data: Prisma.ProductCreateInput): Promise<Product> {
        return this.db.product.create({
            data,
            include: {
                category: true,
            },
        })
    }

    async findById(id: string): Promise<Product | null> {
        return this.db.product.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: true,
            },
        })
    }

    async findAll(params?: {
        skip?: number
        take?: number
        orderBy?: Prisma.ProductOrderByWithRelationInput
        where?: Prisma.ProductWhereInput
    }): Promise<Product[]> {
        const { skip, take, orderBy, where } = params || {}
        return this.db.product.findMany({
            skip,
            take,
            orderBy,
            where,
            include: {
                category: true,
            },
        })
    }

    async update(
        id: string,
        data: Prisma.ProductUpdateInput
    ): Promise<Product> {
        return this.db.product.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        })
    }

    async delete(id: string): Promise<Product> {
        return this.db.product.delete({
            where: { id },
        })
    }

    async count(where?: Prisma.ProductWhereInput): Promise<number> {
        return this.db.product.count({ where })
    }
}
