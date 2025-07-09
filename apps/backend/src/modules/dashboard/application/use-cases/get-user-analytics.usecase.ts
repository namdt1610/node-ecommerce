import {
    IDashboardRepository,
    UserAnalytics,
} from '../../domain/interfaces/dashboard-repository.interface'

export class GetUserAnalyticsUseCase {
    constructor(private dashboardRepository: IDashboardRepository) {}

    async execute(): Promise<UserAnalytics> {
        try {
            return await this.dashboardRepository.getUserAnalytics()
        } catch (error) {
            throw new Error(
                `Failed to get user analytics: ${(error as Error).message}`
            )
        }
    }
}
