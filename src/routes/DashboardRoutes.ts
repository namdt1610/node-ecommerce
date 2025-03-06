import express from 'express'
import { getDashboardStats } from '../controllers/DashboardController'

const router = express.Router()

router.get('/stats', getDashboardStats)

export default router

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: number
 *                 totalRevenue:
 *                   type: number
 */
