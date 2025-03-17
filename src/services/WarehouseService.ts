import { uowWrapper } from '@/utils/uowWrapper'

export class WarehouseService {
    async findById(warehouseId: string) {
        return uowWrapper(async (uow) => {
            const warehouse =
                await uow.warehouseRepository.findById(warehouseId)
            if (!warehouse) throw new Error('Warehouse not found')
            return warehouse
        })
    }

    async findAll() {
        return uowWrapper(async (uow) => {
            return await uow.warehouseRepository.findAll()
        })
    }

    async findByQuery(query: any) {
        return uowWrapper(async (uow) => {
            return await uow.warehouseRepository.findByQuery(query)
        })
    }

    async create(warehouseData: any) {
        return uowWrapper(async (uow) => {
            const newWarehouse =
                await uow.warehouseRepository.create(warehouseData)
            return newWarehouse
        })
    }

    async update(warehouseId: string, updateData: any) {
        return uowWrapper(async (uow) => {
            const updatedWarehouse = await uow.warehouseRepository.update(
                warehouseId,
                updateData
            )
            if (!updatedWarehouse) throw new Error('Warehouse not found')
            return updatedWarehouse
        })
    }

    async delete(warehouseId: string) {
        return uowWrapper(async (uow) => {
            const result = await uow.warehouseRepository.delete(warehouseId)
            if (result.deletedCount === 0)
                throw new Error('Warehouse not found')
            return { success: true, message: 'Warehouse deleted successfully' }
        })
    }
}
