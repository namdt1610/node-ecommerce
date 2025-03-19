import { NextFunction, Request, Response } from 'express'
import { DashboardService } from '@/services/DashboardService'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\controllers\DashboardController.ts
interface UserRequest extends Request {
    user?: {
        userId: string
    }
}

class DashboardController {
    private dashboardService: DashboardService

    constructor() {
        this.dashboardService = new DashboardService()
        this.getUserStats = this.getUserStats.bind(this)
        this.getSystemMetrics = this.getSystemMetrics.bind(this)
        // this.getRecentActivity = this.getRecentActivity.bind(this)
        this.getDashboardSummary = this.getDashboardSummary.bind(this)
    }

    async getUserStats(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.userId || (req.user as any)?.userId
            const stats = await this.dashboardService.getUserStats(userId)
            res.json(stats)
        } catch (error) {
            next(error)
        }
    }

    async getSystemMetrics(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const metrics = await this.dashboardService.getSystemMetrics()
            res.json(metrics)
        } catch (error) {
            next(error)
        }
    }

    // async getRecentActivity(
    //     req: UserRequest,
    //     res: Response,
    //     next: NextFunction
    // ): Promise<void> {
    //     try {
    //         const userId = req.params.userId || (req.user as any)?.userId
    //         const limit = parseInt(req.query.limit as string) || 10
    //         const activities = await this.dashboardService.getRecentActivity(
    //             userId,
    //             limit
    //         )
    //         res.json(activities)
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    async getDashboardSummary(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.userId || (req.user as any)?.userId
            const summary =
                await this.dashboardService.getDashboardSummary(userId)
            res.json(summary)
        } catch (error) {
            next(error)
        }
    }
}

export default new DashboardController()
