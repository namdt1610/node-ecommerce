// Export dashboard routes
export {
    dashboardModuleRoutes as dashboardRoutes,
    createDashboardRoutesWithController,
} from './routes'

// Export dashboard controller for testing
export {
    createDashboardController,
    getSocketService,
    initializeSocketService,
} from './container'

// Export interfaces
export * from './domain/interfaces/dashboard-repository.interface'
export * from './domain/interfaces/dashboard-container'

// Export socket service
export { SocketService } from './infrastructure/services/socket.service'
