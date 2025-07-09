"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSalesAnalyticsUseCase = void 0;
class GetSalesAnalyticsUseCase {
    dashboardRepository;
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    async execute(days) {
        try {
            return await this.dashboardRepository.getSalesAnalytics(days);
        }
        catch (error) {
            throw new Error(`Failed to get sales analytics: ${error.message}`);
        }
    }
}
exports.GetSalesAnalyticsUseCase = GetSalesAnalyticsUseCase;
