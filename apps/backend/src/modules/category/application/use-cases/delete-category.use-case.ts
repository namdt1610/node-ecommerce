import { CategoryRepositoryInterface } from '../../domain/interfaces/category.repository.interface'

export class DeleteCategoryUseCase {
    constructor(private categoryRepository: CategoryRepositoryInterface) {}

    async execute(id: string): Promise<void> {
        await this.categoryRepository.delete(id)
    }
}
