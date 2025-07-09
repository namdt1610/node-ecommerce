import { Category } from '@prisma/client'
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto'

export interface CategoryRepositoryInterface {
    create(data: CreateCategoryDto & { slug: string }): Promise<Category>
    findById(id: string): Promise<Category | null>
    findByName(name: string): Promise<Category | null>
    findBySlug(slug: string): Promise<Category | null>
    findAll(params?: {
        skip?: number
        take?: number
        where?: any
        orderBy?: any
    }): Promise<Category[]>
    update(id: string, data: UpdateCategoryDto): Promise<Category>
    delete(id: string): Promise<void>
    count(where?: any): Promise<number>
}
