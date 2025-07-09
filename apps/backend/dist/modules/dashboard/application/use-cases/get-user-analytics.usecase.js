"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserAnalyticsUseCase = void 0;
class GetUserAnalyticsUseCase {
    dashboardRepository;
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    async execute() {
        try {
            return await this.dashboardRepository.getUserAnalytics();
        }
        catch (error) {
            throw new Error(`Failed to get user analytics: ${error.message}`);
        }
    }
}
exports.GetUserAnalyticsUseCase = GetUserAnalyticsUseCase;
