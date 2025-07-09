import { CategoryRepositoryInterface } from '../../domain/interfaces/category.repository.interface'
import { CategoryResponseDto } from '../../dto'
import { mapCategoryToResponseDto } from '../mappers/category.mapper'

export class GetAllCategoriesUseCase {
    constructor(private categoryRepository: CategoryRepositoryInterface) {}

    async execute(params?: {
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

        return categories.map((category) => mapCategoryToResponseDto(category))
    }
}
