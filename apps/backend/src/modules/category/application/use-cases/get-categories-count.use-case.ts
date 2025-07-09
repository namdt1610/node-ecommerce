import { CategoryRepositoryInterface } from '../../domain/interfaces/category.repository.interface'

export class GetCategoriesCountUseCase {
    constructor(private categoryRepository: CategoryRepositoryInterface) {}

    async execute(search?: string): Promise<number> {
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
}
