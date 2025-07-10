"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryTransferRepository = void 0;
const inventory_entity_1 = require("../../domain/entities/inventory.entity");
class InventoryTransferRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transferStock(fromInventoryId, toInventoryId, quantity, reason, userId) {
        await this.prisma.$transaction(async (tx) => {
            // Get source inventory
            const fromInventory = await tx.inventory.findUnique({
                where: { id: fromInventoryId },
            });
            if (!fromInventory) {
                throw new Error('Source inventory not found');
            }
            if (fromInventory.availableQuantity < quantity) {
                throw new Error('Insufficient quantity for transfer');
            }
            // Get destination inventory
            const toInventory = await tx.inventory.findUnique({
                where: { id: toInventoryId },
            });
            if (!toInventory) {
                throw new Error('Destination inventory not found');
            }
            // Update source inventory (reduce quantity)
            await tx.inventory.update({
                where: { id: fromInventoryId },
                data: {
                    totalQuantity: { decrement: quantity },
                    availableQuantity: { decrement: quantity },
                    updatedAt: new Date(),
                },
            });
            // Update destination inventory (increase quantity)
            await tx.inventory.update({
                where: { id: toInventoryId },
                data: {
                    totalQuantity: { increment: quantity },
                    availableQuantity: { increment: quantity },
                    updatedAt: new Date(),
                },
            });
            // Create movement record for source (OUT)
            await tx.inventoryMovement.create({
                data: {
                    inventoryId: fromInventoryId,
                    type: inventory_entity_1.InventoryMovementType.TRANSFER,
                    quantity: -quantity, // Negative for outgoing
                    referenceId: toInventoryId,
                    referenceType: inventory_entity_1.InventoryReferenceType.TRANSFER,
                    reason: `Transfer out: ${reason}`,
                    unitCost: fromInventory.unitCost,
                    totalCost: fromInventory.unitCost * quantity,
                    userId,
                    createdAt: new Date(),
                },
            });
            // Create movement record for destination (IN)
            await tx.inventoryMovement.create({
                data: {
                    inventoryId: toInventoryId,
                    type: inventory_entity_1.InventoryMovementType.TRANSFER,
                    quantity: quantity, // Positive for incoming
                    referenceId: fromInventoryId,
                    referenceType: inventory_entity_1.InventoryReferenceType.TRANSFER,
                    reason: `Transfer in: ${reason}`,
                    unitCost: fromInventory.unitCost,
                    totalCost: fromInventory.unitCost * quantity,
                    userId,
                    createdAt: new Date(),
                },
            });
        });
    }
    async bulkTransfer(transfers) {
        await this.prisma.$transaction(async (tx) => {
            for (const transfer of transfers) {
                // Validate source inventory
                const fromInventory = await tx.inventory.findUnique({
                    where: { id: transfer.fromInventoryId },
                });
                if (!fromInventory) {
                    throw new Error(`Source inventory ${transfer.fromInventoryId} not found`);
                }
                if (fromInventory.availableQuantity < transfer.quantity) {
                    throw new Error(`Insufficient quantity in ${transfer.fromInventoryId}`);
                }
            }
            // Execute all transfers
            for (const transfer of transfers) {
                await this.transferStockInTransaction(tx, transfer);
            }
        });
    }
    async transferStockInTransaction(tx, transfer) {
        const { fromInventoryId, toInventoryId, quantity, reason, userId } = transfer;
        // Get inventories
        const [fromInventory, toInventory] = await Promise.all([
            tx.inventory.findUnique({ where: { id: fromInventoryId } }),
            tx.inventory.findUnique({ where: { id: toInventoryId } }),
        ]);
        // Update quantities
        await Promise.all([
            tx.inventory.update({
                where: { id: fromInventoryId },
                data: {
                    totalQuantity: { decrement: quantity },
                    availableQuantity: { decrement: quantity },
                    updatedAt: new Date(),
                },
            }),
            tx.inventory.update({
                where: { id: toInventoryId },
                data: {
                    totalQuantity: { increment: quantity },
                    availableQuantity: { increment: quantity },
                    updatedAt: new Date(),
                },
            }),
        ]);
        // Create movement records
        await Promise.all([
            tx.inventoryMovement.create({
                data: {
                    inventoryId: fromInventoryId,
                    type: inventory_entity_1.InventoryMovementType.TRANSFER,
                    quantity: -quantity,
                    referenceId: toInventoryId,
                    referenceType: inventory_entity_1.InventoryReferenceType.TRANSFER,
                    reason: `Transfer out: ${reason}`,
                    unitCost: fromInventory.unitCost,
                    totalCost: fromInventory.unitCost * quantity,
                    userId,
                    createdAt: new Date(),
                },
            }),
            tx.inventoryMovement.create({
                data: {
                    inventoryId: toInventoryId,
                    type: inventory_entity_1.InventoryMovementType.TRANSFER,
                    quantity: quantity,
                    referenceId: fromInventoryId,
                    referenceType: inventory_entity_1.InventoryReferenceType.TRANSFER,
                    reason: `Transfer in: ${reason}`,
                    unitCost: fromInventory.unitCost,
                    totalCost: fromInventory.unitCost * quantity,
                    userId,
                    createdAt: new Date(),
                },
            }),
        ]);
    }
}
exports.InventoryTransferRepository = InventoryTransferRepository;
