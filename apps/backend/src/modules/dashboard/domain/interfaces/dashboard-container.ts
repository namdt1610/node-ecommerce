import { IDashboardRepository } from './dashboard-repository.interface'
import { GetDashboardStatsUseCase } from '../../application/use-cases/get-dashboard-stats.usecase'
import { GetSalesAnalyticsUseCase } from '../../application/use-cases/get-sales-analytics.usecase'
import { GetUserAnalyticsUseCase } from '../../application/use-cases/get-user-analytics.usecase'
import { GetProductAnalyticsUseCase } from '../../application/use-cases/get-product-analytics.usecase'
import { GetRecentActivityUseCase } from '../../application/use-cases/get-recent-activity.usecase'
import { SocketService } from '../../infrastructure/services/socket.service'

// DI Container Interface
export interface IDashboardContainer {
    dashboardRepository: IDashboardRepository
    getDashboardStatsUseCase: GetDashboardStatsUseCase
    getSalesAnalyticsUseCase: GetSalesAnalyticsUseCase
    getUserAnalyticsUseCase: GetUserAnalyticsUseCase
    getProductAnalyticsUseCase: GetProductAnalyticsUseCase
    getRecentActivityUseCase: GetRecentActivityUseCase
    socketService: SocketService
}

// Factory type for creating container
export type DashboardContainerFactory = () => IDashboardContainer
