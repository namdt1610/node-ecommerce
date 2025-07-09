"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
class ProductController {
    createProductUseCase;
    getProductByIdUseCase;
    getAllProductsUseCase;
    getProductsCountUseCase;
    updateProductUseCase;
    deleteProductUseCase;
    searchProductsUseCase;
    constructor(createProductUseCase, getProductByIdUseCase, getAllProductsUseCase, getProductsCountUseCase, updateProductUseCase, deleteProductUseCase, searchProductsUseCase) {
        this.createProductUseCase = createProductUseCase;
        this.getProductByIdUseCase = getProductByIdUseCase;
        this.getAllProductsUseCase = getAllProductsUseCase;
        this.getProductsCountUseCase = getProductsCountUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.deleteProductUseCase = deleteProductUseCase;
        this.searchProductsUseCase = searchProductsUseCase;
    }
    async createProduct(req, res) {
        try {
            const product = await this.createProductUseCase.execute(req.body);
            res.status(201).json({ success: true, data: product });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await this.getProductByIdUseCase.execute(id);
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
                return;
            }
            res.json({ success: true, data: product });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAllProducts(req, res) {
        try {
            const { page = '1', limit = '10', search, categoryId } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const take = parseInt(limit);
            const products = await this.getAllProductsUseCase.execute({
                skip,
                take,
                search: search,
                categoryId: categoryId,
            });
            // Get total count for pagination using the dedicated use case
            const totalCount = await this.getProductsCountUseCase.execute(search, categoryId);
            res.json({
                success: true,
                data: products,
                meta: {
                    total: totalCount,
                    page: parseInt(page),
                    limit: take,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async searchProducts(req, res) {
        try {
            const searchOptions = req.query;
            const result = await this.searchProductsUseCase.execute(searchOptions);
            res.json({
                success: true,
                data: result.products,
                meta: {
                    total: result.total,
                    hasMore: result.hasMore,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await this.updateProductUseCase.execute(id, req.body);
            res.json({ success: true, data: product });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await this.deleteProductUseCase.execute(id);
            res.json({ success: true, message: 'Product deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.ProductController = ProductController;
