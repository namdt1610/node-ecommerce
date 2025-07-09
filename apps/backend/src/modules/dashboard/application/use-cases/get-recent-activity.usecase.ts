import { IDashboardRepository } from '../../domain/interfaces/dashboard-repository.interface'

export class GetRecentActivityUseCase {
    constructor(private dashboardRepository: IDashboardRepository) {}

    async execute(): Promise<any[]> {
        try {
            return await this.dashboardRepository.getRecentActivity()
        } catch (error) {
            throw new Error(
                `Failed to get recent activity: ${(error as Error).message}`
            )
        }
    }
}
