import { CategoryResponseDto } from '../../dto'

export function mapCategoryToResponseDto(category: any): CategoryResponseDto {
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
