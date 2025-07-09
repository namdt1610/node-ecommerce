"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
class DashboardController {
    getDashboardStatsUseCase;
    getSalesAnalyticsUseCase;
    getUserAnalyticsUseCase;
    getProductAnalyticsUseCase;
    getRecentActivityUseCase;
    socketService;
    constructor(getDashboardStatsUseCase, getSalesAnalyticsUseCase, getUserAnalyticsUseCase, getProductAnalyticsUseCase, getRecentActivityUseCase, socketService) {
        this.getDashboardStatsUseCase = getDashboardStatsUseCase;
        this.getSalesAnalyticsUseCase = getSalesAnalyticsUseCase;
        this.getUserAnalyticsUseCase = getUserAnalyticsUseCase;
        this.getProductAnalyticsUseCase = getProductAnalyticsUseCase;
        this.getRecentActivityUseCase = getRecentActivityUseCase;
        this.socketService = socketService;
    }
    async getDashboardStats(req, res) {
        try {
            // Admin access is already verified by middleware
            const stats = await this.getDashboardStatsUseCase.execute();
            // Emit real-time update to connected admins
            this.socketService.emitStatsUpdate(stats);
            res.json({
                success: true,
                data: stats,
                message: 'Dashboard stats retrieved successfully',
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
    async getSalesAnalytics(req, res) {
        try {
            const days = req.query.days
                ? parseInt(req.query.days)
                : undefined;
            const salesAnalytics = await this.getSalesAnalyticsUseCase.execute(days);
            // Emit real-time update
            this.socketService.emitSalesUpdate(salesAnalytics);
            res.json({
                success: true,
                data: salesAnalytics,
                message: 'Sales analytics retrieved successfully',
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
    async getUserAnalytics(req, res) {
        try {
            const userAnalytics = await this.getUserAnalyticsUseCase.execute();
            // Emit real-time update
            this.socketService.emitUsersUpdate(userAnalytics);
            res.json({
                success: true,
                data: userAnalytics,
                message: 'User analytics retrieved successfully',
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
    async getProductAnalytics(req, res) {
        try {
            const productAnalytics = await this.getProductAnalyticsUseCase.execute();
            // Emit real-time update
            this.socketService.emitProductsUpdate(productAnalytics);
            res.json({
                success: true,
                data: productAnalytics,
                message: 'Product analytics retrieved successfully',
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
    async getRecentActivity(req, res) {
        try {
            const activity = await this.getRecentActivityUseCase.execute();
            // Emit real-time update
            this.socketService.emitActivityUpdate(activity);
            res.json({
                success: true,
                data: activity,
                message: 'Recent activity retrieved successfully',
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
    // Get all dashboard data in one request
    async getAllDashboardData(req, res) {
        try {
            const days = req.query.days
                ? parseInt(req.query.days)
                : 30;
            const [stats, salesAnalytics, userAnalytics, productAnalytics, recentActivity,] = await Promise.all([
                this.getDashboardStatsUseCase.execute(),
                this.getSalesAnalyticsUseCase.execute(days),
                this.getUserAnalyticsUseCase.execute(),
                this.getProductAnalyticsUseCase.execute(),
                this.getRecentActivityUseCase.execute(),
            ]);
            const dashboardData = {
                stats,
                salesAnalytics,
                userAnalytics,
                productAnalytics,
                recentActivity,
                timestamp: new Date(),
            };
            // Emit complete dashboard update
            this.socketService.emitDashboardUpdate({
                type: 'stats',
                data: dashboardData,
                timestamp: new Date(),
            });
            res.json({
                success: true,
                data: dashboardData,
                message: 'Complete dashboard data retrieved successfully',
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
    // Trigger manual refresh for all connected admins
    async triggerRefresh(req, res) {
        try {
            // Send refresh command to all connected admins
            this.socketService.emitNotification({
                title: 'Dashboard Refresh',
                message: 'Dashboard data is being refreshed',
                type: 'info',
            });
            res.json({
                success: true,
                message: 'Refresh triggered for all connected admins',
                connectedAdmins: this.socketService.getConnectedAdminsCount(),
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
    // Get real-time dashboard status
    async getDashboardStatus(req, res) {
        try {
            res.json({
                success: true,
                data: {
                    connectedAdmins: this.socketService.getConnectedAdminsCount(),
                    realTimeEnabled: true,
                    lastUpdated: new Date(),
                },
                message: 'Dashboard status retrieved successfully',
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
}
exports.DashboardController = DashboardController;
