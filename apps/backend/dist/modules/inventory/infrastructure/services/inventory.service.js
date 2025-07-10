"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const database_1 = __importDefault(require("../../../../config/database"));
class InventoryService {
    db;
    constructor() {
        this.db = database_1.default;
    }
    async getInventory(productId) {
        const product = await this.db.product.findUnique({
            where: { id: productId },
            select: { inventory: true },
        });
        if (!product?.inventory) {
            throw new Error(`Không tìm thấy tồn kho cho sản phẩm ${productId}`);
        }
        return product.inventory;
    }
    async reserve(productId, quantity) {
        const inventory = await this.getInventory(productId);
        if (inventory.availableQuantity < quantity) {
            throw new Error(`Sản phẩm ${productId} không đủ hàng`);
        }
        const updatedInventory = {
            ...inventory,
            availableQuantity: inventory.availableQuantity - quantity,
            reservedQuantity: inventory.reservedQuantity + quantity,
        };
        await this.db.product.update({
            where: { id: productId },
            data: { inventory: updatedInventory },
        });
    }
}
exports.InventoryService = InventoryService;
