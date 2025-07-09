"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
class CategoryService {
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
    async createCategory(createCategoryDto) {
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
        return this.mapToResponseDto(category);
    }
    async getCategoryById(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            return null;
        }
        return this.mapToResponseDto(category);
    }
    async getAllCategories(params) {
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
        return categories.map((category) => this.mapToResponseDto(category));
    }
    async updateCategory(id, updateCategoryDto) {
        const category = await this.categoryRepository.update(id, updateCategoryDto);
        return this.mapToResponseDto(category);
    }
    async deleteCategory(id) {
        await this.categoryRepository.delete(id);
    }
    async getCategoriesCount(search) {
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
    mapToResponseDto(category) {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || undefined,
            imageUrl: category.imageUrl || undefined,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }
}
exports.CategoryService = CategoryService;
