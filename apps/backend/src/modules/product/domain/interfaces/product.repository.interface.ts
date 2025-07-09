import { Product } from '@prisma/client'
import { CreateProductDto, UpdateProductDto } from '../../dto'

export interface ProductRepositoryInterface {
    create(data: CreateProductDto & { slug: string }): Promise<Product>
    findById(id: string): Promise<Product | null>
    findAll(params?: {
        skip?: number
        take?: number
        where?: any
        orderBy?: any
    }): Promise<Product[]>
    update(id: string, data: UpdateProductDto): Promise<Product>
    delete(id: string): Promise<void>
    count(where?: any): Promise<number>
    findBySlug(slug: string): Promise<Product | null>
}
