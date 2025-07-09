import { PrismaClient, Category } from '@prisma/client'
import { CategoryRepositoryInterface } from '../../domain/interfaces/category.repository.interface'
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto'

export class CategoryRepository implements CategoryRepositoryInterface {
    constructor(private prisma: PrismaClient) {}

    async create(
        data: CreateCategoryDto & { slug: string }
    ): Promise<Category> {
        return this.prisma.category.create({
            data,
        })
    }

    async findById(id: string): Promise<Category | null> {
        return this.prisma.category.findUnique({
            where: { id },
        })
    }

    async findByName(name: string): Promise<Category | null> {
        return this.prisma.category.findUnique({
            where: { name },
        })
    }

    async findBySlug(slug: string): Promise<Category | null> {
        return this.prisma.category.findUnique({
            where: { slug },
        })
    }

    async findAll(params?: {
        skip?: number
        take?: number
        where?: any
        orderBy?: any
    }): Promise<Category[]> {
        const { skip, take, where, orderBy } = params || {}
        return this.prisma.category.findMany({
            skip,
            take,
            where,
            orderBy,
        })
    }

    async update(id: string, data: UpdateCategoryDto): Promise<Category> {
        return this.prisma.category.update({
            where: { id },
            data,
        })
    }

    async delete(id: string): Promise<void> {
        await this.prisma.category.delete({
            where: { id },
        })
    }

    async count(where?: any): Promise<number> {
        return this.prisma.category.count({
            where,
        })
    }
}
