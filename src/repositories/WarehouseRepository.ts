import mongoose from 'mongoose'
import Warehouse from '@/models/WarehouseModel'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\repositories\WarehouseRepository.ts

export class WarehouseRepository {
      private session: mongoose.ClientSession | null = null

      setSession(session: mongoose.ClientSession) {
            this.session = session
      }

      async findById(warehouseId: string) {
            return Warehouse.findById(warehouseId).session(this.session as any)
      }

      async findAll() {
            return Warehouse.find().session(this.session as any)
      }

      async findByQuery(query: any) {
            return Warehouse.find(query).session(this.session as any)
      }

      async create(warehouseData: any) {
            const [warehouse] = await Warehouse.create([warehouseData], {
                  session: this.session as any,
            })
            return warehouse
      }

      async update(warehouseId: string, updateData: any) {
            return Warehouse.findByIdAndUpdate(warehouseId, updateData, { new: true })
                  .session(this.session as any)
      }

      async delete(warehouseId: string) {
            return Warehouse.deleteOne({ _id: warehouseId }).session(this.session as any)
      }
}