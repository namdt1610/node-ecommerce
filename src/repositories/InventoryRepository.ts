import mongoose from 'mongoose'
import Inventory from '@/models/InventoryModel'

export class InventoryRepository {
    private session: mongoose.ClientSession | null = null

    setSession(session: mongoose.ClientSession) {
        this.session = session
    }

    async findById(itemId: string) {
        return Inventory.findById(itemId).session(this.session as any)
    }

    async findByCode(itemCode: string) {
        return Inventory.findOne({ code: itemCode }).session(
            this.session as any
        )
    }

    async findAll() {
        return Inventory.find().session(this.session as any)
    }

    async findByCategory(category: string) {
        return Inventory.find({ category }).session(this.session as any)
    }

    async createItem(itemData: any) {
        const [item] = await Inventory.create([itemData], {
            session: this.session as any,
        })
        return item
    }

    async updateItem(itemId: string, updateData: any) {
        return Inventory.findByIdAndUpdate(itemId, updateData, {
            new: true,
        }).session(this.session as any)
    }

    async updateQuantity(itemId: string, quantity: number) {
        return Inventory.findByIdAndUpdate(
            itemId,
            { $inc: { quantity } },
            { new: true }
        ).session(this.session as any)
    }

    async deleteItem(itemId: string) {
        return Inventory.deleteOne({ _id: itemId }).session(this.session as any)
    }

    async countItems() {
        return Inventory.countDocuments().session(this.session as any)
    }

    async countByCategory(category: string) {
        return Inventory.countDocuments({ category }).session(
            this.session as any
        )
    }

    async countLowStockItems(threshold: number) {
        return Inventory.countDocuments({
            quantity: { $lt: threshold },
        }).session(this.session as any)
    }

    async countOutOfStockItems() {
        return Inventory.countDocuments({ quantity: 0 }).session(
            this.session as any
        )
    }

    async getActivities() {
        return Inventory.aggregate([
            {
                $lookup: {
                    from: 'activities',
                    localField: '_id',
                    foreignField: 'inventoryId',
                    as: 'activities',
                },
            },
            {
                $unwind: {
                    path: '$activities',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    code: 1,
                    quantity: 1,
                    category: 1,
                    'activities.action': 1,
                    'activities.timestamp': 1,
                },
            },
            {
                $sort: {
                    'activities.timestamp': -1,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    code: { $first: '$code' },
                    quantity: { $first: '$quantity' },
                    category: { $first: '$category' },
                    activities: {
                        $push: {
                            action: '$activities.action',
                            timestamp: '$activities.timestamp',
                        },
                    },
                },
            },
        ]).session(this.session as any)
    }
}
