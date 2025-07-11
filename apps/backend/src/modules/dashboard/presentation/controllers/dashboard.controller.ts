import { Request, Response } from 'express'
import { GetDashboardStatsUseCase } from '../../application/use-cases/get-dashboard-stats.usecase'
import { GetSalesAnalyticsUseCase } from '../../application/use-cases/get-sales-analytics.usecase'
import { GetUserAnalyticsUseCase } from '../../application/use-cases/get-user-analytics.usecase'
import { GetProductAnalyticsUseCase } from '../../application/use-cases/get-product-analytics.usecase'
import { GetRecentActivityUseCase } from '../../application/use-cases/get-recent-activity.usecase'
import { SocketService } from '../../infrastructure/services/socket.service'

export class DashboardController {
    constructor(
        private getDashboardStatsUseCase: GetDashboardStatsUseCase,
        private getSalesAnalyticsUseCase: GetSalesAnalyticsUseCase,
        private getUserAnalyticsUseCase: GetUserAnalyticsUseCase,
        private getProductAnalyticsUseCase: GetProductAnalyticsUseCase,
        private getRecentActivityUseCase: GetRecentActivityUseCase,
        private socketService: SocketService
    ) {}

    async getDashboardStats(req: Request, res: Response) {
        try {
            // Admin access is already verified by middleware
            const stats = await this.getDashboardStatsUseCase.execute()

            // Emit real-time update to connected admins
            this.socketService.emitStatsUpdate(stats)

            res.json({
                success: true,
                data: stats,
                message: 'Dashboard stats retrieved successfully',
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    }

    async getSalesAnalytics(req: Request, res: Response) {
        try {
            const days = req.query.days
                ? parseInt(req.query.days as string)
                : undefined
            const salesAnalytics =
                await this.getSalesAnalyticsUseCase.execute(days)

            // Emit real-time update
            this.socketService.emitSalesUpdate(salesAnalytics)

            res.json({
                success: true,
                data: salesAnalytics,
                message: 'Sales analytics retrieved successfully',
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    }

    async getUserAnalytics(req: Request, res: Response) {
        try {
            const userAnalytics = await this.getUserAnalyticsUseCase.execute()

            // Emit real-time update
            this.socketService.emitUsersUpdate(userAnalytics)

            res.json({
                success: true,
                data: userAnalytics,
                message: 'User analytics retrieved successfully',
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    }

    async getProductAnalytics(req: Request, res: Response) {
        try {
            const productAnalytics =
                await this.getProductAnalyticsUseCase.execute()

            // Emit real-time update
            this.socketService.emitProductsUpdate(productAnalytics)

            res.json({
                success: true,
                data: productAnalytics,
                message: 'Product analytics retrieved successfully',
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    }

    async getRecentActivity(req: Request, res: Response) {
        try {
            const activity = await this.getRecentActivityUseCase.execute()

            // Emit real-time update
            this.socketService.emitActivityUpdate(activity)

            res.json({
                success: true,
                data: activity,
                message: 'Recent activity retrieved successfully',
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    }

    // Get all dashboard data in one request
    async getAllDashboardData(req: Request, res: Response) {
        try {
            const days = req.query.days
                ? parseInt(req.query.days as string)
                : 30

            const [
                stats,
                salesAnalytics,
                userAnalytics,
                productAnalytics,
                recentActivity,
            ] = await Promise.all([
                this.getDashboardStatsUseCase.execute(),
                this.getSalesAnalyticsUseCase.execute(days),
                this.getUserAnalyticsUseCase.execute(),
                this.getProductAnalyticsUseCase.execute(),
                this.getRecentActivityUseCase.execute(),
            ])

            const dashboardData = {
                stats,
                salesAnalytics,
                userAnalytics,
                productAnalytics,
                recentActivity,
                timestamp: new Date(),
            }

            // Emit complete dashboard update
            this.socketService.emitDashboardUpdate({
                type: 'stats',
                data: dashboardData,
                timestamp: new Date(),
            })

            res.json({
                success: true,
                data: dashboardData,
                message: 'Complete dashboard data retrieved successfully',
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    }

    // Trigger manual refresh for all connected admins
    async triggerRefresh(req: Request, res: Response) {
        try {
            // Send refresh command to all connected admins
            this.socketService.emitNotification({
                title: 'Dashboard Refresh',
                message: 'Dashboard data is being refreshed',
                type: 'info',
            })

            res.json({
                success: true,
                message: 'Refresh triggered for all connected admins',
                connectedAdmins: this.socketService.getConnectedAdminsCount(),
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    }

    // Get real-time dashboard status
    async getDashboardStatus(req: Request, res: Response) {
        try {
            res.json({
                success: true,
                data: {
                    connectedAdmins:
                        this.socketService.getConnectedAdminsCount(),
                    realTimeEnabled: true,
                    lastUpdated: new Date(),
                },
                message: 'Dashboard status retrieved successfully',
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    }
}
