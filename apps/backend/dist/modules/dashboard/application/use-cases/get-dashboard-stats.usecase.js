"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDashboardStatsUseCase = void 0;
class GetDashboardStatsUseCase {
    dashboardRepository;
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    async execute() {
        try {
            return await this.dashboardRepository.getDashboardStats();
        }
        catch (error) {
            throw new Error(`Failed to get dashboard stats: ${error.message}`);
        }
    }
}
exports.GetDashboardStatsUseCase = GetDashboardStatsUseCase;
