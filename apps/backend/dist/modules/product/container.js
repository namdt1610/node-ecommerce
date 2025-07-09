"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductController = createProductController;
const product_controller_1 = require("./presentation/controllers/product.controller");
const create_product_usecase_1 = require("./application/use-cases/create-product.usecase");
const get_product_by_id_usecase_1 = require("./application/use-cases/get-product-by-id.usecase");
const get_all_products_usecase_1 = require("./application/use-cases/get-all-products.usecase");
const get_products_count_use_case_1 = require("./application/use-cases/get-products-count.use-case");
const update_product_usecase_1 = require("./application/use-cases/update-product.usecase");
const delete_product_usecase_1 = require("./application/use-cases/delete-product.usecase");
const search_products_usecase_1 = require("./application/use-cases/search-products.usecase");
const product_repository_1 = require("./infrastructure/repositories/product.repository");
const database_1 = __importDefault(require("../../config/database"));
// Create Product Controller with DI
function createProductController() {
    const productRepository = new product_repository_1.ProductRepository(database_1.default);
    const createProductUseCase = new create_product_usecase_1.CreateProductUseCase(productRepository);
    const getProductByIdUseCase = new get_product_by_id_usecase_1.GetProductByIdUseCase(productRepository);
    const getAllProductsUseCase = new get_all_products_usecase_1.GetAllProductsUseCase(productRepository);
    const getProductsCountUseCase = new get_products_count_use_case_1.GetProductsCountUseCase(productRepository);
    const updateProductUseCase = new update_product_usecase_1.UpdateProductUseCase(productRepository);
    const deleteProductUseCase = new delete_product_usecase_1.DeleteProductUseCase(productRepository);
    const searchProductsUseCase = new search_products_usecase_1.SearchProductsUseCase(productRepository);
    return new product_controller_1.ProductController(createProductUseCase, getProductByIdUseCase, getAllProductsUseCase, getProductsCountUseCase, updateProductUseCase, deleteProductUseCase, searchProductsUseCase);
}
