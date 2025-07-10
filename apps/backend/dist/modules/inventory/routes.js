"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryModuleRoutes = inventoryModuleRoutes;
const express_1 = require("express");
const container_1 = require("./container");
const async_handler_1 = require("../../utils/async-handler");
function inventoryModuleRoutes() {
    const router = (0, express_1.Router)();
    const container = (0, container_1.createInventoryContainer)();
    const readController = container.readController;
    const writeController = container.writeController;
    // Read Operations
    router.get('/', (0, async_handler_1.asyncHandler)(readController.getAllInventories.bind(readController)));
    router.get('/stats', (0, async_handler_1.asyncHandler)(readController.getInventoryStats.bind(readController)));
    router.get('/:id', (0, async_handler_1.asyncHandler)(readController.getInventoryById.bind(readController)));
    router.get('/:productId/availability', (0, async_handler_1.asyncHandler)(readController.checkAvailability.bind(readController)));
    // Write Operations
    router.post('/', (0, async_handler_1.asyncHandler)(writeController.createInventory.bind(writeController)));
    router.put('/:id', (0, async_handler_1.asyncHandler)(writeController.updateInventory.bind(writeController)));
    router.delete('/:id', (0, async_handler_1.asyncHandler)(writeController.deleteInventory.bind(writeController)));
    // Stock Operations
    router.post('/reserve', (0, async_handler_1.asyncHandler)(writeController.reserveStock.bind(writeController)));
    router.post('/release', (0, async_handler_1.asyncHandler)(writeController.releaseStock.bind(writeController)));
    return router;
}
