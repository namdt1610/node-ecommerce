import { CategoryRepository } from './category.repository'
import {
    CreateCategoryDto,
    UpdateCategoryDto,
    CategoryResponseDto,
} from './dto'
import { Category } from '@prisma/client'

export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    async createCategory(
        createCategoryDto: CreateCategoryDto
    ): Promise<CategoryResponseDto> {
        // Check if category already exists
        const existingCategory = await this.categoryRepository.findByName(
            createCategoryDto.name
        )
        if (existingCategory) {
            throw new Error('Category already exists')
        }

        // Generate slug from name
        const slug = this.generateSlug(createCategoryDto.name)

        // Check if slug already exists
        const existingSlug = await this.categoryRepository.findBySlug(slug)
        if (existingSlug) {
            throw new Error('Category with similar name already exists')
        }

        const category = await this.categoryRepository.create({
            ...createCategoryDto,
            slug,
        })
        return this.mapToResponseDto(category)
    }

    async getCategoryById(id: string): Promise<CategoryResponseDto | null> {
        const category = await this.categoryRepository.findById(id)
        if (!category) {
            return null
        }
        return this.mapToResponseDto(category)
    }

    async getAllCategories(params?: {
        skip?: number
        take?: number
        search?: string
    }): Promise<CategoryResponseDto[]> {
        const { skip, take, search } = params || {}

        const where = search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          description: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : undefined

        const categories = await this.categoryRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        })

        return categories.map((category) => this.mapToResponseDto(category))
    }

    async updateCategory(
        id: string,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<CategoryResponseDto> {
        const category = await this.categoryRepository.update(
            id,
            updateCategoryDto
        )
        return this.mapToResponseDto(category)
    }

    async deleteCategory(id: string): Promise<void> {
        await this.categoryRepository.delete(id)
    }

    async getCategoriesCount(search?: string): Promise<number> {
        const where = search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          description: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : undefined

        return this.categoryRepository.count(where)
    }

    private mapToResponseDto(category: Category): CategoryResponseDto {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || undefined,
            imageUrl: category.imageUrl || undefined,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }
    }
}
