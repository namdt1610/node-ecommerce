import {
    IDashboardRepository,
    SalesAnalytics,
} from '../../domain/interfaces/dashboard-repository.interface'

export class GetSalesAnalyticsUseCase {
    constructor(private dashboardRepository: IDashboardRepository) {}

    async execute(days?: number): Promise<SalesAnalytics> {
        try {
            return await this.dashboardRepository.getSalesAnalytics(days)
        } catch (error) {
            throw new Error(
                `Failed to get sales analytics: ${(error as Error).message}`
            )
        }
    }
}
