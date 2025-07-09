"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoryByIdUseCase = void 0;
const category_mapper_1 = require("../mappers/category.mapper");
class GetCategoryByIdUseCase {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            return null;
        }
        return (0, category_mapper_1.mapCategoryToResponseDto)(category);
    }
}
exports.GetCategoryByIdUseCase = GetCategoryByIdUseCase;
