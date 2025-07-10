import { z } from 'zod'
import {
    InventoryMovementType,
    InventoryReferenceType,
} from '../../domain/entities/inventory.entity'

// Base schemas
export const InventoryMovementTypeSchema = z.nativeEnum(InventoryMovementType)
export const InventoryReferenceTypeSchema = z.nativeEnum(InventoryReferenceType)

// Create Inventory DTO
export const CreateInventorySchema = z.object({
    productId: z.string().uuid(),
    warehouseId: z.string().uuid().optional(),
    sku: z.string().min(1).max(50),
    totalQuantity: z.number().int().min(0),
    lowStockThreshold: z.number().int().min(0).default(5),
    allowBackorder: z.boolean().default(false),
    backorderLimit: z.number().int().min(0).optional(),
    reorderPoint: z.number().int().min(0).default(10),
    reorderQuantity: z.number().int().min(1).default(50),
    unitCost: z.number().min(0),
    location: z.string().max(100).optional(),
    batch: z.string().max(50).optional(),
    expiryDate: z.string().datetime().optional(),
    notes: z.string().max(500).optional(),
})

export type CreateInventoryDto = z.infer<typeof CreateInventorySchema>

// Update Inventory DTO
export const UpdateInventorySchema = z.object({
    totalQuantity: z.number().int().min(0).optional(),
    lowStockThreshold: z.number().int().min(0).optional(),
    allowBackorder: z.boolean().optional(),
    backorderLimit: z.number().int().min(0).optional(),
    reorderPoint: z.number().int().min(0).optional(),
    reorderQuantity: z.number().int().min(1).optional(),
    unitCost: z.number().min(0).optional(),
    location: z.string().max(100).optional(),
    batch: z.string().max(50).optional(),
    expiryDate: z.string().datetime().optional(),
    notes: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
})

export type UpdateInventoryDto = z.infer<typeof UpdateInventorySchema>

// Stock Movement DTO
export const StockMovementSchema = z.object({
    quantity: z.number().int().min(1),
    type: InventoryMovementTypeSchema,
    reason: z.string().min(1).max(200),
    referenceId: z.string().optional(),
    referenceType: InventoryReferenceTypeSchema.optional(),
    notes: z.string().max(500).optional(),
    unitCost: z.number().min(0).optional(),
})

export type StockMovementDto = z.infer<typeof StockMovementSchema>

// Stock Adjustment DTO
export const StockAdjustmentSchema = z.object({
    newQuantity: z.number().int().min(0),
    reason: z.string().min(1).max(200),
    notes: z.string().max(500).optional(),
})

export type StockAdjustmentDto = z.infer<typeof StockAdjustmentSchema>

// Reserve Stock DTO
export const ReserveStockSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
    referenceId: z.string().optional(),
    referenceType: InventoryReferenceTypeSchema.optional(),
    reason: z.string().min(1).max(200).default('Stock reservation'),
})

export type ReserveStockDto = z.infer<typeof ReserveStockSchema>

// Query DTOs
export const InventoryQuerySchema = z.object({
    page: z
        .string()
        .transform(Number)
        .pipe(z.number().int().min(1))
        .default('1'),
    limit: z
        .string()
        .transform(Number)
        .pipe(z.number().int().min(1).max(100))
        .default('10'),
    warehouseId: z.string().uuid().optional(),
    lowStock: z
        .string()
        .transform((val) => val === 'true')
        .optional(),
    expired: z
        .string()
        .transform((val) => val === 'true')
        .optional(),
    search: z.string().min(1).optional(),
})

export type InventoryQueryDto = z.infer<typeof InventoryQuerySchema>

export const MovementQuerySchema = z.object({
    page: z
        .string()
        .transform(Number)
        .pipe(z.number().int().min(1))
        .default('1'),
    limit: z
        .string()
        .transform(Number)
        .pipe(z.number().int().min(1).max(100))
        .default('10'),
    type: InventoryMovementTypeSchema.optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
})

export type MovementQueryDto = z.infer<typeof MovementQuerySchema>

// Response DTOs
export interface InventoryResponseDto {
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
    expiryDate?: string
    isTracked: boolean
    isActive: boolean
    lastStockCheck?: string
    notes?: string
    createdAt: string
    updatedAt: string
}

export interface InventoryMovementResponseDto {
    id: string
    inventoryId: string
    type: InventoryMovementType
    quantity: number
    referenceId?: string
    referenceType?: InventoryReferenceType
    reason: string
    notes?: string
    unitCost?: number
    totalCost?: number
    userId?: string
    createdAt: string
}

export interface InventoryStatsResponseDto {
    totalItems: number
    totalValue: number
    lowStockItems: number
    outOfStockItems: number
    expiredItems: number
    expiringItems: number
}
