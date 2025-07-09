"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCategoryToResponseDto = mapCategoryToResponseDto;
function mapCategoryToResponseDto(category) {
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
