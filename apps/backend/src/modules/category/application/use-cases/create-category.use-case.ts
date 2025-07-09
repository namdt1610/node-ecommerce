import { CategoryRepositoryInterface } from '../../domain/interfaces/category.repository.interface'
import { CreateCategoryDto, CategoryResponseDto } from '../../dto'
import { mapCategoryToResponseDto } from '../mappers/category.mapper'

export class CreateCategoryUseCase {
    constructor(private categoryRepository: CategoryRepositoryInterface) {}

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    async execute(
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

        return mapCategoryToResponseDto(category)
    }
}
