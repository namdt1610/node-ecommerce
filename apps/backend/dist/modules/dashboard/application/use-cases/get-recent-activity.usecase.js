"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRecentActivityUseCase = void 0;
class GetRecentActivityUseCase {
    dashboardRepository;
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    async execute() {
        try {
            return await this.dashboardRepository.getRecentActivity();
        }
        catch (error) {
            throw new Error(`Failed to get recent activity: ${error.message}`);
        }
    }
}
exports.GetRecentActivityUseCase = GetRecentActivityUseCase;
