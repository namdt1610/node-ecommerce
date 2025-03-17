import { uowWrapper } from '@/utils/uowWrapper'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\services\InventoryService.ts

export class InventoryService {
    async addItem(itemData: any) {
        return uowWrapper(async (uow) => {
            const existingItem = await uow.inventoryRepository.findByCode(
                itemData.code
            )
            if (existingItem)
                throw new InventoryError('Item code already exists', 409)

            const newItem = await uow.inventoryRepository.createItem(itemData)
            return { item: newItem, message: 'Item added successfully' }
        })
    }

    async updateItem(itemId: string, itemData: any) {
        return uowWrapper(async (uow) => {
            const item = await uow.inventoryRepository.findById(itemId)
            if (!item) throw new InventoryError('Item not found', 404)

            const updatedItem = await uow.inventoryRepository.updateItem(
                itemId,
                itemData
            )
            return { item: updatedItem, message: 'Item updated successfully' }
        })
    }

    async getItem(itemId: string) {
        return uowWrapper(async (uow) => {
            const item = await uow.inventoryRepository.findById(itemId)
            if (!item) throw new InventoryError('Item not found', 404)
            return item
        })
    }

    async listItems() {
        return uowWrapper(async (uow) => {
            const items = await uow.inventoryRepository.findAll()
        })
    }

    async deleteItem(itemId: string) {
        return uowWrapper(async (uow) => {
            const item = await uow.inventoryRepository.findById(itemId)
            if (!item) throw new InventoryError('Item not found', 404)

            await uow.inventoryRepository.deleteItem(itemId)
            return { message: 'Item deleted successfully' }
        })
    }

    async updateStock(
        itemId: string,
        quantity: number,
        type: 'add' | 'remove'
    ) {
        return uowWrapper(async (uow) => {
            const item = await uow.inventoryRepository.findById(itemId)
            if (!item) throw new InventoryError('Item not found', 404)

            let newQuantity = item.quantity

            if (type === 'add') {
                newQuantity += quantity
            } else {
                if (item.quantity < quantity) {
                    throw new InventoryError('Insufficient stock', 400)
                }
                newQuantity -= quantity
            }

            const updatedItem = await uow.inventoryRepository.updateItem(
                itemId,
                { quantity: newQuantity }
            )
            return { item: updatedItem, message: 'Stock updated successfully' }
        })
    }

    async getInventoryStats() {
        return uowWrapper(async (uow) => {
            const totalItems = await uow.inventoryRepository.countItems()
            const lowStockItems =
                await uow.inventoryRepository.countLowStockItems(10)
            const outOfStockItems =
                await uow.inventoryRepository.countOutOfStockItems()

            return {
                totalItems,
                lowStockItems,
                outOfStockItems,
            }
        })
    }

    async getInventoryActivities() {
        return uowWrapper(async (uow) => {
            const activity = await uow.inventoryRepository.getActivities()
            return activity
        })
    }
}

class InventoryError extends Error {
    statusCode: number

    constructor(message: string, statusCode = 400) {
        super(message)
        this.name = 'InventoryError'
        this.statusCode = statusCode

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InventoryError)
        }
    }
}
