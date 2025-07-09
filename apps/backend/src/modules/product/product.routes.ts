import { Router } from 'express'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ProductRepository } from './product.repository'

const router = Router()

// Initialize dependencies
const productRepository = new ProductRepository()
const productService = new ProductService(productRepository)
const productController = new ProductController(productService)

// Routes
router.post('/', productController.createProduct.bind(productController))
router.get('/', productController.getAllProducts.bind(productController))
router.get('/:id', productController.getProductById.bind(productController))
router.put('/:id', productController.updateProduct.bind(productController))
router.delete('/:id', productController.deleteProduct.bind(productController))

export default router
