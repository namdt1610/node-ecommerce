export interface Inventory {
    id: string
    productId: string
    warehouseId?: string
    sku: string
    totalQuantity: number
    availableQuantity: number
    reservedQuantity: number
    lowStockThreshold: number
    allowBackorder: boolean
    backorderLimit?: number
    reorderPoint: number
    reorderQuantity: number
    unitCost: number
    averageCost: number
    location?: string
    batch?: string
    expiryDate?: Date
    isTracked: boolean
    isActive: boolean
    lastStockCheck?: Date
    notes?: string
    createdAt: Date
    updatedAt: Date
}

export interface InventoryMovement {
    id: string
    inventoryId: string
    type: InventoryMovementType
    quantity: number
    referenceId?: string // Order ID, Transfer ID, etc.
    referenceType?: InventoryReferenceType
    reason: string
    notes?: string
    unitCost?: number
    totalCost?: number
    userId?: string
    createdAt: Date
}

export enum InventoryMovementType {
    STOCK_IN = 'STOCK_IN',
    STOCK_OUT = 'STOCK_OUT',
    ADJUSTMENT = 'ADJUSTMENT',
    RESERVATION = 'RESERVATION',
    RELEASE = 'RELEASE',
    TRANSFER = 'TRANSFER',
    DAMAGE = 'DAMAGE',
    RETURN = 'RETURN',
}

export enum InventoryReferenceType {
    ORDER = 'ORDER',
    PURCHASE_ORDER = 'PURCHASE_ORDER',
    TRANSFER = 'TRANSFER',
    MANUAL = 'MANUAL',
    SYSTEM = 'SYSTEM',
}

export interface InventoryAlert {
    id: string
    inventoryId: string
    type: InventoryAlertType
    message: string
    isResolved: boolean
    resolvedAt?: Date
    createdAt: Date
}

export enum InventoryAlertType {
    LOW_STOCK = 'LOW_STOCK',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    EXPIRED = 'EXPIRED',
    NEAR_EXPIRY = 'NEAR_EXPIRY',
}

// DTOs for creating and updating inventory
export interface CreateInventoryData {
    productId: string
    warehouseId?: string
    sku: string
    totalQuantity: number
    lowStockThreshold: number
    allowBackorder?: boolean
    backorderLimit?: number
    reorderPoint: number
    reorderQuantity: number
    unitCost: number
    location?: string
    batch?: string
    expiryDate?: Date
    notes?: string
}

export interface UpdateInventoryData {
    totalQuantity?: number
    lowStockThreshold?: number
    allowBackorder?: boolean
    backorderLimit?: number
    reorderPoint?: number
    reorderQuantity?: number
    unitCost?: number
    location?: string
    batch?: string
    expiryDate?: Date
    notes?: string
    isActive?: boolean
}

export interface InventoryStockMovement {
    quantity: number
    type: InventoryMovementType
    reason: string
    referenceId?: string
    referenceType?: InventoryReferenceType
    notes?: string
    unitCost?: number
}
