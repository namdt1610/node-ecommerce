import express from 'express'
import DashboardController from '@/controllers/DashboardController'
import verifyToken from '@/middlewares/verifyToken'
import { isAdmin } from '@/middlewares/isAdmin'

const router = express.Router()

// Dashboard routes
router.get('/summary', verifyToken, DashboardController.getDashboardSummary)
router.get('/user-stats', verifyToken, DashboardController.getUserStats)
router.get(
    '/system-metrics',
    verifyToken,
    isAdmin,
    DashboardController.getSystemMetrics
)
router.get(
    '/recent-activity',
    verifyToken,
    DashboardController.getRecentActivity
)

export default router
