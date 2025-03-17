import mongoose from 'mongoose'
import Order from '@/models/OrderModel'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\repositories\OrderRepository.ts

export class OrderRepository {
      private session: mongoose.ClientSession | null = null

      setSession(session: mongoose.ClientSession) {
            this.session = session
      }

      async findById(orderId: string) {
            return Order.findById(orderId).session(this.session as any)
      }

      async findAll(page = 1, limit = 10, filters = {}) {
            const skip = (page - 1) * limit
            return Order.find(filters)
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(limit)
                  .session(this.session as any)
      }

      async findByUser(userId: string, page = 1, limit = 10) {
            const skip = (page - 1) * limit
            return Order.find({ user: userId })
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(limit)
                  .session(this.session as any)
      }

      async createOrder(orderData: any) {
            const [order] = await Order.create([orderData], {
                  session: this.session as any,
            })
            return order
      }

      async updateOrder(orderId: string, updateData: any) {
            return Order.findByIdAndUpdate(
                  orderId,
                  { $set: updateData },
                  { new: true }
            ).session(this.session as any)
      }

      async updateOrderStatus(orderId: string, status: string) {
            return Order.findByIdAndUpdate(
                  orderId,
                  { status },
                  { new: true }
            ).session(this.session as any)
      }

      async deleteOrder(orderId: string) {
            return Order.deleteOne({ _id: orderId }).session(this.session as any)
      }

      async countOrders(filters = {}) {
            return Order.countDocuments(filters).session(this.session as any)
      }
}