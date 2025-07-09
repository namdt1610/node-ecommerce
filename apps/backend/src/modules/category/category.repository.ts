import { PrismaClient, Category, Prisma } from '@prisma/client'
import prisma from '../../config/database'

export class CategoryRepository {
    private db: PrismaClient

    constructor() {
        this.db = prisma
    }

    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        return this.db.category.create({ data })
    }

    async findById(id: string): Promise<Category | null> {
        return this.db.category.findUnique({
            where: { id },
        })
    }

    async findByName(name: string): Promise<Category | null> {
        return this.db.category.findUnique({
            where: { name },
        })
    }

    async findBySlug(slug: string): Promise<Category | null> {
        return this.db.category.findUnique({
            where: { slug },
        })
    }

    async findAll(params?: {
        skip?: number
        take?: number
        orderBy?: Prisma.CategoryOrderByWithRelationInput
        where?: Prisma.CategoryWhereInput
    }): Promise<Category[]> {
        const { skip, take, orderBy, where } = params || {}
        return this.db.category.findMany({
            skip,
            take,
            orderBy,
            where,
        })
    }

    async update(
        id: string,
        data: Prisma.CategoryUpdateInput
    ): Promise<Category> {
        return this.db.category.update({
            where: { id },
            data,
        })
    }

    async delete(id: string): Promise<Category> {
        return this.db.category.delete({
            where: { id },
        })
    }

    async count(where?: Prisma.CategoryWhereInput): Promise<number> {
        return this.db.category.count({ where })
    }
}
