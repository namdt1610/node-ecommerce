import {
    Inventory,
    InventoryMovement,
    InventoryAlert,
    CreateInventoryData,
    UpdateInventoryData,
    InventoryStockMovement,
    InventoryMovementType,
    InventoryAlertType,
} from '../entities/inventory.entity'

export interface IInventoryRepository {
    // Basic CRUD operations
    create(inventoryData: CreateInventoryData): Promise<Inventory>
    findById(id: string): Promise<Inventory | null>
    findByProductId(productId: string): Promise<Inventory | null>
    findBySku(sku: string): Promise<Inventory | null>
    update(id: string, inventoryData: UpdateInventoryData): Promise<Inventory>
    delete(id: string): Promise<void>

    // Listing and search
    findAll(options?: {
        skip?: number
        take?: number
        warehouseId?: string
        lowStock?: boolean
        expired?: boolean
        search?: string
    }): Promise<{
        inventories: Inventory[]
        total: number
    }>

    // Stock management
    updateStock(
        inventoryId: string,
        movement: InventoryStockMovement
    ): Promise<Inventory>

    reserveStock(inventoryId: string, quantity: number): Promise<boolean>
    releaseReservedStock(inventoryId: string, quantity: number): Promise<void>
    adjustStock(
        inventoryId: string,
        newQuantity: number,
        reason: string,
        userId?: string
    ): Promise<Inventory>

    // Availability checks
    checkAvailability(productId: string, quantity: number): Promise<boolean>
    getAvailableQuantity(productId: string): Promise<number>
    isInStock(productId: string): Promise<boolean>

    // Bulk operations
    bulkUpdateStock(
        updates: {
            inventoryId: string
            quantity: number
            type: InventoryMovementType
            reason: string
        }[]
    ): Promise<void>

    // Movements tracking
    createMovement(
        movement: Omit<InventoryMovement, 'id' | 'createdAt'>
    ): Promise<InventoryMovement>
    getMovements(
        inventoryId: string,
        options?: {
            skip?: number
            take?: number
            type?: InventoryMovementType
            dateFrom?: Date
            dateTo?: Date
        }
    ): Promise<{
        movements: InventoryMovement[]
        total: number
    }>

    // Alerts management
    createAlert(
        alert: Omit<InventoryAlert, 'id' | 'createdAt'>
    ): Promise<InventoryAlert>
    getAlerts(options?: {
        skip?: number
        take?: number
        type?: InventoryAlertType
        resolved?: boolean
        inventoryId?: string
    }): Promise<{
        alerts: InventoryAlert[]
        total: number
    }>
    markAlertResolved(alertId: string): Promise<void>

    // Analytics and reporting
    getLowStockItems(warehouseId?: string): Promise<Inventory[]>
    getExpiredItems(warehouseId?: string): Promise<Inventory[]>
    getExpiringItems(days: number, warehouseId?: string): Promise<Inventory[]>
    getStockValue(warehouseId?: string): Promise<number>
    getMovementsSummary(
        dateFrom: Date,
        dateTo: Date,
        warehouseId?: string
    ): Promise<{
        totalIn: number
        totalOut: number
        totalAdjustments: number
        totalValue: number
    }>

    // Warehouse operations
    findByWarehouse(warehouseId: string): Promise<Inventory[]>
    transferStock(
        fromInventoryId: string,
        toInventoryId: string,
        quantity: number,
        reason: string,
        userId?: string
    ): Promise<void>
}
