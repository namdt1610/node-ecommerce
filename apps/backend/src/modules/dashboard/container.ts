import { PrismaClient } from '@prisma/client'
import { Server as HttpServer } from 'http'
import { DashboardController } from './presentation/controllers/dashboard.controller'
import { DashboardRepository } from './infrastructure/repositories/dashboard.repository'
import { GetDashboardStatsUseCase } from './application/use-cases/get-dashboard-stats.usecase'
import { GetSalesAnalyticsUseCase } from './application/use-cases/get-sales-analytics.usecase'
import { GetUserAnalyticsUseCase } from './application/use-cases/get-user-analytics.usecase'
import { GetProductAnalyticsUseCase } from './application/use-cases/get-product-analytics.usecase'
import { GetRecentActivityUseCase } from './application/use-cases/get-recent-activity.usecase'
import { SocketService } from './infrastructure/services/socket.service'
import { IDashboardContainer } from './domain/interfaces/dashboard-container'

// Global socket service instance
let socketServiceInstance: SocketService | null = null

// Create DI Container
function createDashboardContainer(
    httpServer?: HttpServer
): IDashboardContainer {
    const prisma = new PrismaClient()
    const dashboardRepository = new DashboardRepository(prisma)

    // Create or reuse socket service instance
    if (!socketServiceInstance && httpServer) {
        socketServiceInstance = new SocketService(httpServer)
    }

    if (!socketServiceInstance) {
        throw new Error('SocketService requires HTTP server instance')
    }

    return {
        dashboardRepository,
        getDashboardStatsUseCase: new GetDashboardStatsUseCase(
            dashboardRepository
        ),
        getSalesAnalyticsUseCase: new GetSalesAnalyticsUseCase(
            dashboardRepository
        ),
        getUserAnalyticsUseCase: new GetUserAnalyticsUseCase(
            dashboardRepository
        ),
        getProductAnalyticsUseCase: new GetProductAnalyticsUseCase(
            dashboardRepository
        ),
        getRecentActivityUseCase: new GetRecentActivityUseCase(
            dashboardRepository
        ),
        socketService: socketServiceInstance,
    }
}

// Create Dashboard Controller with DI
export function createDashboardController(
    httpServer?: HttpServer
): DashboardController {
    const container = createDashboardContainer(httpServer)

    return new DashboardController(
        container.getDashboardStatsUseCase,
        container.getSalesAnalyticsUseCase,
        container.getUserAnalyticsUseCase,
        container.getProductAnalyticsUseCase,
        container.getRecentActivityUseCase,
        container.socketService
    )
}

// Get socket service instance
export function getSocketService(): SocketService | null {
    return socketServiceInstance
}

// Initialize socket service
export function initializeSocketService(httpServer: HttpServer): SocketService {
    if (!socketServiceInstance) {
        socketServiceInstance = new SocketService(httpServer)
    }
    return socketServiceInstance
}

// Export container for testing
export { createDashboardContainer }
