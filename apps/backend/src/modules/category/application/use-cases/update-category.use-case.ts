import { CategoryRepositoryInterface } from '../../domain/interfaces/category.repository.interface'
import { UpdateCategoryDto, CategoryResponseDto } from '../../dto'
import { mapCategoryToResponseDto } from '../mappers/category.mapper'

export class UpdateCategoryUseCase {
    constructor(private categoryRepository: CategoryRepositoryInterface) {}

    async execute(
        id: string,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<CategoryResponseDto> {
        const category = await this.categoryRepository.update(
            id,
            updateCategoryDto
        )
        return mapCategoryToResponseDto(category)
    }
}
