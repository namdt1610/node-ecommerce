"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryUseCase = void 0;
const category_mapper_1 = require("../mappers/category.mapper");
class UpdateCategoryUseCase {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(id, updateCategoryDto) {
        const category = await this.categoryRepository.update(id, updateCategoryDto);
        return (0, category_mapper_1.mapCategoryToResponseDto)(category);
    }
}
exports.UpdateCategoryUseCase = UpdateCategoryUseCase;
