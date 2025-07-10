"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryContainer = createInventoryContainer;
const inventory_read_controller_1 = require("./presentation/controllers/inventory-read.controller");
const inventory_write_controller_1 = require("./presentation/controllers/inventory-write.controller");
// Use Cases
const create_inventory_usecase_1 = require("./application/use-cases/create-inventory.usecase");
const get_inventory_by_id_usecase_1 = require("./application/use-cases/get-inventory-by-id.usecase");
const get_all_inventories_usecase_1 = require("./application/use-cases/get-all-inventories.usecase");
const update_inventory_usecase_1 = require("./application/use-cases/update-inventory.usecase");
const check_availability_usecase_1 = require("./application/use-cases/check-availability.usecase");
const reserve_stock_usecase_1 = require("./application/use-cases/stock/reserve-stock.usecase");
const release_stock_usecase_1 = require("./application/use-cases/stock/release-stock.usecase");
// Repositories
const inventory_read_repository_1 = require("./infrastructure/repositories/inventory-read.repository");
const inventory_write_repository_1 = require("./infrastructure/repositories/inventory-write.repository");
const inventory_movement_repository_1 = require("./infrastructure/repositories/inventory-movement.repository");
const inventory_alert_repository_1 = require("./infrastructure/repositories/inventory-alert.repository");
const inventory_analytics_repository_1 = require("./infrastructure/repositories/inventory-analytics.repository");
const inventory_transfer_repository_1 = require("./infrastructure/repositories/inventory-transfer.repository");
// Combined repository interface for legacy use cases
const inventory_repository_1 = require("./infrastructure/repositories/inventory.repository");
const database_1 = __importDefault(require("../../config/database"));
function createInventoryContainer() {
    // Specialized Repositories
    const readRepository = new inventory_read_repository_1.InventoryReadRepository(database_1.default);
    const writeRepository = new inventory_write_repository_1.InventoryWriteRepository(database_1.default);
    const movementRepository = new inventory_movement_repository_1.InventoryMovementRepository(database_1.default);
    const alertRepository = new inventory_alert_repository_1.InventoryAlertRepository(database_1.default);
    const analyticsRepository = new inventory_analytics_repository_1.InventoryAnalyticsRepository(database_1.default);
    const transferRepository = new inventory_transfer_repository_1.InventoryTransferRepository(database_1.default);
    const combinedRepository = new inventory_repository_1.InventoryRepository(database_1.default); // Orchestrator repository
    // Read Use Cases
    const getInventoryByIdUseCase = new get_inventory_by_id_usecase_1.GetInventoryByIdUseCase(combinedRepository);
    const getAllInventoriesUseCase = new get_all_inventories_usecase_1.GetAllInventoriesUseCase(combinedRepository);
    const checkAvailabilityUseCase = new check_availability_usecase_1.CheckAvailabilityUseCase(combinedRepository);
    // Write Use Cases
    const createInventoryUseCase = new create_inventory_usecase_1.CreateInventoryUseCase(combinedRepository);
    const updateInventoryUseCase = new update_inventory_usecase_1.UpdateInventoryUseCase(combinedRepository);
    const reserveStockUseCase = new reserve_stock_usecase_1.ReserveStockUseCase(readRepository, writeRepository);
    const releaseStockUseCase = new release_stock_usecase_1.ReleaseStockUseCase(readRepository, writeRepository);
    // Controllers
    const readController = new inventory_read_controller_1.InventoryReadController(getInventoryByIdUseCase, getAllInventoriesUseCase, checkAvailabilityUseCase);
    const writeController = new inventory_write_controller_1.InventoryWriteController(createInventoryUseCase, updateInventoryUseCase, reserveStockUseCase, releaseStockUseCase);
    return {
        // Specialized Repositories
        readRepository,
        writeRepository,
        movementRepository,
        alertRepository,
        analyticsRepository,
        transferRepository,
        combinedRepository,
        // Use Cases
        getInventoryByIdUseCase,
        getAllInventoriesUseCase,
        checkAvailabilityUseCase,
        createInventoryUseCase,
        updateInventoryUseCase,
        reserveStockUseCase,
        releaseStockUseCase,
        // Controllers
        readController,
        writeController,
    };
}
