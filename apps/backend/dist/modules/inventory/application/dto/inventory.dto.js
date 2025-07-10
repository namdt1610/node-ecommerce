"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementQuerySchema = exports.InventoryQuerySchema = exports.ReserveStockSchema = exports.StockAdjustmentSchema = exports.StockMovementSchema = exports.UpdateInventorySchema = exports.CreateInventorySchema = exports.InventoryReferenceTypeSchema = exports.InventoryMovementTypeSchema = void 0;
const zod_1 = require("zod");
const inventory_entity_1 = require("../../domain/entities/inventory.entity");
// Base schemas
exports.InventoryMovementTypeSchema = zod_1.z.nativeEnum(inventory_entity_1.InventoryMovementType);
exports.InventoryReferenceTypeSchema = zod_1.z.nativeEnum(inventory_entity_1.InventoryReferenceType);
// Create Inventory DTO
exports.CreateInventorySchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    warehouseId: zod_1.z.string().uuid().optional(),
    sku: zod_1.z.string().min(1).max(50),
    totalQuantity: zod_1.z.number().int().min(0),
    lowStockThreshold: zod_1.z.number().int().min(0).default(5),
    allowBackorder: zod_1.z.boolean().default(false),
    backorderLimit: zod_1.z.number().int().min(0).optional(),
    reorderPoint: zod_1.z.number().int().min(0).default(10),
    reorderQuantity: zod_1.z.number().int().min(1).default(50),
    unitCost: zod_1.z.number().min(0),
    location: zod_1.z.string().max(100).optional(),
    batch: zod_1.z.string().max(50).optional(),
    expiryDate: zod_1.z.string().datetime().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
// Update Inventory DTO
exports.UpdateInventorySchema = zod_1.z.object({
    totalQuantity: zod_1.z.number().int().min(0).optional(),
    lowStockThreshold: zod_1.z.number().int().min(0).optional(),
    allowBackorder: zod_1.z.boolean().optional(),
    backorderLimit: zod_1.z.number().int().min(0).optional(),
    reorderPoint: zod_1.z.number().int().min(0).optional(),
    reorderQuantity: zod_1.z.number().int().min(1).optional(),
    unitCost: zod_1.z.number().min(0).optional(),
    location: zod_1.z.string().max(100).optional(),
    batch: zod_1.z.string().max(50).optional(),
    expiryDate: zod_1.z.string().datetime().optional(),
    notes: zod_1.z.string().max(500).optional(),
    isActive: zod_1.z.boolean().optional(),
});
// Stock Movement DTO
exports.StockMovementSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().min(1),
    type: exports.InventoryMovementTypeSchema,
    reason: zod_1.z.string().min(1).max(200),
    referenceId: zod_1.z.string().optional(),
    referenceType: exports.InventoryReferenceTypeSchema.optional(),
    notes: zod_1.z.string().max(500).optional(),
    unitCost: zod_1.z.number().min(0).optional(),
});
// Stock Adjustment DTO
exports.StockAdjustmentSchema = zod_1.z.object({
    newQuantity: zod_1.z.number().int().min(0),
    reason: zod_1.z.string().min(1).max(200),
    notes: zod_1.z.string().max(500).optional(),
});
// Reserve Stock DTO
exports.ReserveStockSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().min(1),
    referenceId: zod_1.z.string().optional(),
    referenceType: exports.InventoryReferenceTypeSchema.optional(),
    reason: zod_1.z.string().min(1).max(200).default('Stock reservation'),
});
// Query DTOs
exports.InventoryQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().int().min(1))
        .default('1'),
    limit: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().int().min(1).max(100))
        .default('10'),
    warehouseId: zod_1.z.string().uuid().optional(),
    lowStock: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .optional(),
    expired: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .optional(),
    search: zod_1.z.string().min(1).optional(),
});
exports.MovementQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().int().min(1))
        .default('1'),
    limit: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().int().min(1).max(100))
        .default('10'),
    type: exports.InventoryMovementTypeSchema.optional(),
    dateFrom: zod_1.z.string().datetime().optional(),
    dateTo: zod_1.z.string().datetime().optional(),
});
