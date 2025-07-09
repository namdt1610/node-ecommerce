"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const category_repository_1 = require("./infrastructure/repositories/category.repository");
const create_category_use_case_1 = require("./application/use-cases/create-category.use-case");
const get_category_by_id_use_case_1 = require("./application/use-cases/get-category-by-id.use-case");
const get_all_categories_use_case_1 = require("./application/use-cases/get-all-categories.use-case");
const update_category_use_case_1 = require("./application/use-cases/update-category.use-case");
const delete_category_use_case_1 = require("./application/use-cases/delete-category.use-case");
const get_categories_count_use_case_1 = require("./application/use-cases/get-categories-count.use-case");
const category_controller_1 = require("./presentation/controllers/category.controller");
const database_1 = __importDefault(require("../../config/database"));
// Repository
const categoryRepository = new category_repository_1.CategoryRepository(database_1.default);
// Use Cases
const createCategoryUseCase = new create_category_use_case_1.CreateCategoryUseCase(categoryRepository);
const getCategoryByIdUseCase = new get_category_by_id_use_case_1.GetCategoryByIdUseCase(categoryRepository);
const getAllCategoriesUseCase = new get_all_categories_use_case_1.GetAllCategoriesUseCase(categoryRepository);
const updateCategoryUseCase = new update_category_use_case_1.UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new delete_category_use_case_1.DeleteCategoryUseCase(categoryRepository);
const getCategoriesCountUseCase = new get_categories_count_use_case_1.GetCategoriesCountUseCase(categoryRepository);
// Controller
const categoryController = new category_controller_1.CategoryController(createCategoryUseCase, getCategoryByIdUseCase, getAllCategoriesUseCase, updateCategoryUseCase, deleteCategoryUseCase, getCategoriesCountUseCase);
exports.categoryController = categoryController;
