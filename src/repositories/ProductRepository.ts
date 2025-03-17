import mongoose from 'mongoose'
import Product from '@/models/ProductModel'

export class ProductRepository {
      private session: mongoose.ClientSession | null = null

      setSession(session: mongoose.ClientSession) {
            this.session = session
      }

      async findAll(options = {}) {
            return Product.find(options).session(this.session as any)
      }

      async findById(productId: string) {
            return Product.findById(productId).session(this.session as any)
      }

      async findByCategory(category: string) {
            return Product.find({ category }).session(this.session as any)
      }

      async create(productData: any) {
            const [product] = await Product.create([productData], {
                  session: this.session as any,
            })
            return product
      }

      async update(productId: string, updateData: any) {
            return Product.findByIdAndUpdate(productId, updateData, {
                  new: true,
                  session: this.session as any,
            })
      }

      async delete(productId: string) {
            return Product.deleteOne({ _id: productId }).session(this.session as any)
      }

      async search(query: string) {
            return Product.find({
                  $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                  ]
            }).session(this.session as any)
      }
}