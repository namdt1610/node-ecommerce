"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoriesCountUseCase = void 0;
class GetCategoriesCountUseCase {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(search) {
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
            : undefined;
        return this.categoryRepository.count(where);
    }
}
exports.GetCategoriesCountUseCase = GetCategoriesCountUseCase;
