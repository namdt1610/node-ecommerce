import { CategoryRepository } from './infrastructure/repositories/category.repository'
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case'
import { GetCategoryByIdUseCase } from './application/use-cases/get-category-by-id.use-case'
import { GetAllCategoriesUseCase } from './application/use-cases/get-all-categories.use-case'
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case'
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case'
import { GetCategoriesCountUseCase } from './application/use-cases/get-categories-count.use-case'
import { CategoryController } from './presentation/controllers/category.controller'
import prisma from '../../config/database'

// Repository
const categoryRepository = new CategoryRepository(prisma)

// Use Cases
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository)
const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository)
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository)
const getCategoriesCountUseCase = new GetCategoriesCountUseCase(
    categoryRepository
)

// Controller
const categoryController = new CategoryController(
    createCategoryUseCase,
    getCategoryByIdUseCase,
    getAllCategoriesUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,
    getCategoriesCountUseCase
)

export { categoryController }
