import mongoose from 'mongoose'
import Category from '@/models/CategoryModel'
import Product from '@/models/ProductModel'
import Warehouse from '@/models/WarehouseModel'
import Review from '@/models/ReviewModel'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\repositories\CategoryRepository.ts

export class CategoryRepository {
    private session: mongoose.ClientSession | null = null

    setSession(session: mongoose.ClientSession) {
        this.session = session
    }

    async findAll() {
        return Category.find().session(this.session as any)
    }

    async findById(categoryId: string) {
        return Category.findById(categoryId).session(this.session as any)
    }

    async findByName(name: string) {
        return Category.findOne({ name }).session(this.session as any)
    }

    async create(categoryData: any) {
        const [category] = await Category.create([categoryData], {
            session: this.session as any,
        })
        return category
    }

    async update(categoryId: string, updateData: any) {
        return Category.findByIdAndUpdate(categoryId, updateData, {
            new: true,
        }).session(this.session as any)
    }

    async delete(categoryId: string) {
        return Category.deleteOne({ _id: categoryId }).session(
            this.session as any
        )
    }

    async deleteMany(categoryIds: string[]) {
        return Category.deleteMany({ _id: { $in: categoryIds } }).session(
            this.session as any
        )
    }

    async checkAssociations(categoryId: string) {
        const products = await Product.find({ category: categoryId }).session(
            this.session as any
        )
        const warehouses = await Warehouse.find({
            category: categoryId,
        }).session(this.session as any)
        const reviews = await Review.find({ category: categoryId }).session(
            this.session as any
        )
        return {
            products: products.length > 0,
            warehouses: warehouses.length > 0,
            reviews: reviews.length > 0,
        }
    }
}
