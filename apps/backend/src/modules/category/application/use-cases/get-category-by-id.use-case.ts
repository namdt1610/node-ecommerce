import { CategoryRepositoryInterface } from '../../domain/interfaces/category.repository.interface'
import { CategoryResponseDto } from '../../dto'
import { mapCategoryToResponseDto } from '../mappers/category.mapper'

export class GetCategoryByIdUseCase {
    constructor(private categoryRepository: CategoryRepositoryInterface) {}

    async execute(id: string): Promise<CategoryResponseDto | null> {
        const category = await this.categoryRepository.findById(id)
        if (!category) {
            return null
        }
        return mapCategoryToResponseDto(category)
    }
}
