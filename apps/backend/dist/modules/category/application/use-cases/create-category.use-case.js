"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategoryUseCase = void 0;
const category_mapper_1 = require("../mappers/category.mapper");
class CreateCategoryUseCase {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async execute(createCategoryDto) {
        // Check if category already exists
        const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
        if (existingCategory) {
            throw new Error('Category already exists');
        }
        // Generate slug from name
        const slug = this.generateSlug(createCategoryDto.name);
        // Check if slug already exists
        const existingSlug = await this.categoryRepository.findBySlug(slug);
        if (existingSlug) {
            throw new Error('Category with similar name already exists');
        }
        const category = await this.categoryRepository.create({
            ...createCategoryDto,
            slug,
        });
        return (0, category_mapper_1.mapCategoryToResponseDto)(category);
    }
}
exports.CreateCategoryUseCase = CreateCategoryUseCase;
