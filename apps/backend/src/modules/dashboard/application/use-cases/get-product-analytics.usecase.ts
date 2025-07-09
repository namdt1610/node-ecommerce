import {
    IDashboardRepository,
    ProductAnalytics,
} from '../../domain/interfaces/dashboard-repository.interface'

export class GetProductAnalyticsUseCase {
    constructor(private dashboardRepository: IDashboardRepository) {}

    async execute(): Promise<ProductAnalytics> {
        try {
            return await this.dashboardRepository.getProductAnalytics()
        } catch (error) {
            throw new Error(
                `Failed to get product analytics: ${(error as Error).message}`
            )
        }
    }
}
