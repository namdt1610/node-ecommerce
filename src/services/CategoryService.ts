import { uowWrapper } from '@/utils/uowWrapper'

export class CategoryService {
    async getAllCategories() {
        return uowWrapper(async (uow) => {
            const categories = await uow.categoryRepository.findAll()
            return categories
        })
    }

    async getCategoryById(id: string) {
        return uowWrapper(async (uow) => {
            const category = await uow.categoryRepository.findById(id)
            if (!category) throw new Error('Category not found')
            return category
        })
    }

    async createCategory(name: string, description?: string) {
        return uowWrapper(async (uow) => {
            // Check if category with the same name already exists
            const existingCategory =
                await uow.categoryRepository.findByName(name)
            if (existingCategory)
                throw new Error('Category with this name already exists')

            const category = await uow.categoryRepository.create({
                name,
                description,
            })

            return category
        })
    }

    async updateCategory(
        id: string,
        data: { name?: string; description?: string }
    ) {
        return uowWrapper(async (uow) => {
            // Check if category exists
            const category = await uow.categoryRepository.findById(id)
            if (!category) throw new Error('Category not found')

            // If updating name, check if new name is already taken
            if (data.name && data.name !== category.name) {
                const existingCategory =
                    await uow.categoryRepository.findByName(data.name)
                if (existingCategory)
                    throw new Error('Category with this name already exists')
            }

            const updatedCategory = await uow.categoryRepository.update(
                id,
                data
            )
            return updatedCategory
        })
    }

    async deleteCategory(id: string) {
        return uowWrapper(async (uow) => {
            const category = await uow.categoryRepository.findById(id)
            if (!category) throw new Error('Category not found')

            // Check if there are associated products or other dependencies
            const hasAssociations =
                await uow.categoryRepository.checkAssociations(id)
            if (hasAssociations) {
                throw new Error(
                    'Cannot delete category with existing associations'
                )
            }

            await uow.categoryRepository.delete(id)
            return { success: true, message: 'Category deleted successfully' }
        })
    }
}
