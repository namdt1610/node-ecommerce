"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDashboardController = createDashboardController;
exports.getSocketService = getSocketService;
exports.initializeSocketService = initializeSocketService;
exports.createDashboardContainer = createDashboardContainer;
const client_1 = require("@prisma/client");
const dashboard_controller_1 = require("./presentation/controllers/dashboard.controller");
const dashboard_repository_1 = require("./infrastructure/repositories/dashboard.repository");
const get_dashboard_stats_usecase_1 = require("./application/use-cases/get-dashboard-stats.usecase");
const get_sales_analytics_usecase_1 = require("./application/use-cases/get-sales-analytics.usecase");
const get_user_analytics_usecase_1 = require("./application/use-cases/get-user-analytics.usecase");
const get_product_analytics_usecase_1 = require("./application/use-cases/get-product-analytics.usecase");
const get_recent_activity_usecase_1 = require("./application/use-cases/get-recent-activity.usecase");
const socket_service_1 = require("./infrastructure/services/socket.service");
// Global socket service instance
let socketServiceInstance = null;
// Create DI Container
function createDashboardContainer(httpServer) {
    const prisma = new client_1.PrismaClient();
    const dashboardRepository = new dashboard_repository_1.DashboardRepository(prisma);
    // Create or reuse socket service instance
    if (!socketServiceInstance && httpServer) {
        socketServiceInstance = new socket_service_1.SocketService(httpServer);
    }
    if (!socketServiceInstance) {
        throw new Error('SocketService requires HTTP server instance');
    }
    return {
        dashboardRepository,
        getDashboardStatsUseCase: new get_dashboard_stats_usecase_1.GetDashboardStatsUseCase(dashboardRepository),
        getSalesAnalyticsUseCase: new get_sales_analytics_usecase_1.GetSalesAnalyticsUseCase(dashboardRepository),
        getUserAnalyticsUseCase: new get_user_analytics_usecase_1.GetUserAnalyticsUseCase(dashboardRepository),
        getProductAnalyticsUseCase: new get_product_analytics_usecase_1.GetProductAnalyticsUseCase(dashboardRepository),
        getRecentActivityUseCase: new get_recent_activity_usecase_1.GetRecentActivityUseCase(dashboardRepository),
        socketService: socketServiceInstance,
    };
}
// Create Dashboard Controller with DI
function createDashboardController(httpServer) {
    const container = createDashboardContainer(httpServer);
    return new dashboard_controller_1.DashboardController(container.getDashboardStatsUseCase, container.getSalesAnalyticsUseCase, container.getUserAnalyticsUseCase, container.getProductAnalyticsUseCase, container.getRecentActivityUseCase, container.socketService);
}
// Get socket service instance
function getSocketService() {
    return socketServiceInstance;
}
// Initialize socket service
function initializeSocketService(httpServer) {
    if (!socketServiceInstance) {
        socketServiceInstance = new socket_service_1.SocketService(httpServer);
    }
    return socketServiceInstance;
}
