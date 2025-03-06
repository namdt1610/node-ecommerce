import { Request, Response } from 'express'
import Order from '../models/OrderModel'
import Product from '../models/ProductModel'
import User from '../models/UserModel'
import Category from '../models/CategoryModel'

export const getDashboardStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Get current date and date 30 days ago
        const today = new Date()
        const thirtyDaysAgo = new Date(
            today.getTime() - 30 * 24 * 60 * 60 * 1000
        )
        // Basic stats
        const [
            totalOrders,
            totalProducts,
            totalUsers,
            totalCategories,
            recentOrders,
            topProducts,
            salesData,
            categoryStats,
        ] = await Promise.all([
            // Total counts
            Order.countDocuments(),
            Product.countDocuments(),
            User.countDocuments(),
            Category.countDocuments(),

            // Recent orders
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'name email')
                .populate('orderItems.product', 'name price'),

            // Top selling products
            Product.find()
                .sort({ soldCount: -1 })
                .limit(5)
                .select('name price soldCount clickCount'),

            // Sales data for last 30 days
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: thirtyDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$createdAt',
                            },
                        },
                        sales: { $sum: '$totalAmount' },
                        orders: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]),

            // Category statistics
            Category.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'products',
                    },
                },
                {
                    $project: {
                        name: 1,
                        productCount: { $size: '$products' },
                        totalSales: {
                            $sum: {
                                $map: {
                                    input: '$products',
                                    as: 'product',
                                    in: {
                                        $multiply: [
                                            '$$product.price',
                                            '$$product.soldCount',
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $sort: { totalSales: -1 },
                },
            ]),
        ])

        // Calculate revenue metrics
        const totalRevenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' },
                },
            },
        ])

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' },
                },
            },
        ])
        res.json({
            stats: {
                totalOrders,
                totalProducts,
                totalUsers,
                totalCategories,
                totalRevenue: totalRevenue[0]?.total || 0,
                monthlyRevenue: monthlyRevenue[0]?.total || 0,
            },
            recentOrders,
            topProducts,
            salesData,
            categoryStats,
        })
    } catch (error) {
        console.error('Dashboard Stats Error:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: (error as Error).message,
        })
    }
}
