import { Router } from 'express'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { OrderRepository } from './order.repository'
import { authMiddleware } from '@/common/middlewares/auth.middleware'

const router = Router()

const orderRepository = new OrderRepository()
const orderService = new OrderService(orderRepository)
const orderController = new OrderController(orderService)

// All order routes require authentication
router.use(authMiddleware)

router.post('/', orderController.createOrder.bind(orderController))
router.get('/', orderController.getAllOrders.bind(orderController))
router.get('/:id', orderController.getOrderById.bind(orderController))
router.put('/:id', orderController.updateOrder.bind(orderController))
router.put(
    '/:id/status',
    orderController.updateOrderStatus.bind(orderController)
)
router.delete('/:id', orderController.deleteOrder.bind(orderController))

export default router
