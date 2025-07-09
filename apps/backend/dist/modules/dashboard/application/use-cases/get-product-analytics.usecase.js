"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductAnalyticsUseCase = void 0;
class GetProductAnalyticsUseCase {
    dashboardRepository;
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    async execute() {
        try {
            return await this.dashboardRepository.getProductAnalytics();
        }
        catch (error) {
            throw new Error(`Failed to get product analytics: ${error.message}`);
        }
    }
}
exports.GetProductAnalyticsUseCase = GetProductAnalyticsUseCase;
