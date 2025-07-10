"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderContainer = createOrderContainer;
const order_controller_1 = require("./presentation/controllers/order.controller");
const order_tracking_controller_1 = require("./presentation/controllers/order-tracking.controller");
const create_order_usecase_1 = require("./application/use-cases/create-order.usecase");
const get_order_by_id_usecase_1 = require("./application/use-cases/get-order-by-id.usecase");
const get_orders_by_user_usecase_1 = require("./application/use-cases/get-orders-by-user.usecase");
const update_order_usecase_1 = require("./application/use-cases/update-order.usecase");
const prisma_order_repository_1 = require("./infrastructure/repositories/prisma-order.repository");
const order_tracking_service_1 = require("./infrastructure/services/order-tracking.service");
function createOrderContainer(io) {
    // Repository
    const orderRepository = new prisma_order_repository_1.PrismaOrderRepository();
    // Use Cases
    const createOrderUseCase = new create_order_usecase_1.CreateOrderUseCase(orderRepository);
    const getOrderByIdUseCase = new get_order_by_id_usecase_1.GetOrderByIdUseCase(orderRepository);
    const getOrdersByUserUseCase = new get_orders_by_user_usecase_1.GetOrdersByUserUseCase(orderRepository);
    const updateOrderUseCase = new update_order_usecase_1.UpdateOrderUseCase(orderRepository);
    // Controller
    const orderController = new order_controller_1.OrderController(createOrderUseCase, getOrderByIdUseCase, getOrdersByUserUseCase, updateOrderUseCase);
    // Tracking Service and Controller (optional, requires Socket.IO)
    let orderTrackingService;
    let orderTrackingController;
    if (io) {
        orderTrackingService = new order_tracking_service_1.OrderTrackingService(io, orderRepository);
        orderTrackingController = new order_tracking_controller_1.OrderTrackingController(orderTrackingService);
    }
    return {
        orderRepository,
        createOrderUseCase,
        getOrderByIdUseCase,
        getOrdersByUserUseCase,
        updateOrderUseCase,
        orderController,
        orderTrackingService,
        orderTrackingController,
    };
}
