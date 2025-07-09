import { PrismaClient, Product } from '@prisma/client'
import { ProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface'
import { CreateProductDto, UpdateProductDto } from '../../dto'

export class ProductRepository implements ProductRepositoryInterface {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateProductDto & { slug: string }): Promise<Product> {
        return this.prisma.product.create({
            data,
            include: { category: true },
        })
    }

    async findById(id: string): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        })
    }

    async findBySlug(slug: string): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { slug },
            include: { category: true },
        })
    }

    async findAll(params?: {
        skip?: number
        take?: number
        where?: any
        orderBy?: any
    }): Promise<Product[]> {
        const { skip, take, where, orderBy } = params || {}
        return this.prisma.product.findMany({
            skip,
            take,
            where,
            orderBy,
            include: { category: true },
        })
    }

    async update(id: string, data: UpdateProductDto): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
            include: { category: true },
        })
    }

    async delete(id: string): Promise<void> {
        await this.prisma.product.delete({
            where: { id },
        })
    }

    async count(where?: any): Promise<number> {
        return this.prisma.product.count({
            where,
        })
    }
}
