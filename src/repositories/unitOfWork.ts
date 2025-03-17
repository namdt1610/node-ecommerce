import mongoose from 'mongoose'
import { UserRepository } from '@/repositories/UserRepository'
import { TokenRepository } from '@/repositories/TokenRepository'
import { CartRepository } from '@/repositories/CartRepository'
import { CategoryRepository } from '@/repositories/CategoryRepository'
import { DashboardRepository } from './DashboardRepository'
import { ReviewRepository } from '@/repositories/ReviewRepository'
import { OrderRepository } from '@/repositories/OrderRepository'
import { InventoryRepository } from './InventoryRepository'
import { ProductRepository } from '@/repositories/ProductRepository'
import { WarehouseRepository } from '@/repositories/WarehouseRepository'

export class UnitOfWork {
    private session: mongoose.ClientSession | null = null
    userRepository: UserRepository
    tokenRepository: TokenRepository
    cartRepository: CartRepository
    categoryRepository: CategoryRepository
    productRepository: ProductRepository
    warehouseRepository: WarehouseRepository
    dashboardRepository: DashboardRepository
    reviewRepository: ReviewRepository
    orderRepository: OrderRepository
    inventoryRepository: InventoryRepository

    constructor() {
        this.userRepository = new UserRepository()
        this.tokenRepository = new TokenRepository()
        this.cartRepository = new CartRepository()
        this.categoryRepository = new CategoryRepository()
        this.productRepository = new ProductRepository()
        this.warehouseRepository = new WarehouseRepository()
        this.dashboardRepository = new DashboardRepository()
        this.reviewRepository = new ReviewRepository()
        this.orderRepository = new OrderRepository()
        this.inventoryRepository = new InventoryRepository()
    }

    async start(): Promise<void> {
        this.session = await mongoose.startSession()
        this.session.startTransaction()
        this.userRepository.setSession(this.session)
        this.tokenRepository.setSession(this.session)
        this.cartRepository.setSession(this.session)
        this.categoryRepository.setSession(this.session)
        this.productRepository.setSession(this.session)
        this.warehouseRepository.setSession(this.session)
        this.dashboardRepository.setSession(this.session)
        this.reviewRepository.setSession(this.session)
        this.orderRepository.setSession(this.session)
        this.inventoryRepository.setSession(this.session)
    }

    async commit(): Promise<void> {
        if (this.session) {
            await this.session.commitTransaction()
            this.session.endSession()
            this.session = null
        }
    }

    async rollback(): Promise<void> {
        if (this.session) {
            await this.session.abortTransaction()
            this.session.endSession()
            this.session = null
        }
    }
}
