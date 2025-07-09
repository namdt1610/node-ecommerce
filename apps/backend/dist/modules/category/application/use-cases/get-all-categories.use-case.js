"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllCategoriesUseCase = void 0;
const category_mapper_1 = require("../mappers/category.mapper");
class GetAllCategoriesUseCase {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(params) {
        const { skip, take, search } = params || {};
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
        const categories = await this.categoryRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        });
        return categories.map((category) => (0, category_mapper_1.mapCategoryToResponseDto)(category));
    }
}
exports.GetAllCategoriesUseCase = GetAllCategoriesUseCase;
