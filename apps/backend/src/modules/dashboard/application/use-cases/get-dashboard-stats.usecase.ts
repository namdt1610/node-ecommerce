import {
    IDashboardRepository,
    DashboardStats,
} from '../../domain/interfaces/dashboard-repository.interface'

export class GetDashboardStatsUseCase {
    constructor(private dashboardRepository: IDashboardRepository) {}

    async execute(): Promise<DashboardStats> {
        try {
            return await this.dashboardRepository.getDashboardStats()
        } catch (error) {
            throw new Error(
                `Failed to get dashboard stats: ${(error as Error).message}`
            )
        }
    }
}
