import { UnitOfWork } from '@/repositories/unitOfWork'
import Order from '@/models/OrderModel'
import Inventory from '@/models/InventoryModel'
import User from '@/models/UserModel'
import { sendEmail } from '@/utils/sendEmail'

export class OrderService {
    async createOrder(userId: string, orderData: any, uow: UnitOfWork) {
        const session = uow.getSession()

        const { items, ...orderDetails } = orderData
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error('Order must contain at least one item')
        }

        // Lấy danh sách sản phẩm để kiểm tra tồn kho
        const productIds = items.map((item) => item.product)
        const inventories = await Inventory.find({
            product: { $in: productIds },
        }).session(session)

        // Kiểm tra tồn kho
        for (const item of items) {
            const inventory = inventories.find(
                (inv) => inv.product.toString() === item.product
            )
            if (!inventory || inventory.quantity < item.quantity) {
                throw new Error(
                    `Insufficient stock for product ${item.product}`
                )
            }
        }

        // Cập nhật tồn kho
        await Inventory.bulkWrite(
            items.map((item) => ({
                updateOne: {
                    filter: { product: item.product },
                    update: { $inc: { quantity: -item.quantity } },
                },
            })),
            { session }
        )

        // Tạo đơn hàng
        const order = new Order(orderDetails)
        await order.save({ session })

        // Gửi email xác nhận
        const emailSubject = 'Order Confirmation'
        const emailText = `Thank you for your order! Your order ID is ${order._id}.`
        const emailHtml = `
            <h1>Thank you for your order!</h1>
            <p>Your order ID is <strong>${order._id}</strong>.</p>
        `
        await sendEmail(orderData.email, emailSubject, emailText, emailHtml)

        // Xóa sản phẩm đã mua khỏi giỏ hàng
        await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { productId: { $in: productIds } } } },
            { session }
        )

        return order
    }
}