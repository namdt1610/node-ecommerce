"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAvailabilityUseCase = exports.UpdateInventoryUseCase = exports.GetAllInventoriesUseCase = exports.GetInventoryByIdUseCase = exports.CreateInventoryUseCase = exports.ReleaseStockUseCase = exports.ReserveStockUseCase = exports.InventoryMapper = exports.InventoryValidator = exports.CostCalculator = exports.StockQuantity = exports.InventoryDomainService = exports.InventoryWriteRepository = exports.InventoryReadRepository = exports.InventoryWriteController = exports.InventoryReadController = exports.createInventoryContainer = exports.inventoryModuleRoutes = void 0;
// Re-export main inventory components
var routes_1 = require("./routes");
Object.defineProperty(exports, "inventoryModuleRoutes", { enumerable: true, get: function () { return routes_1.inventoryModuleRoutes; } });
var container_1 = require("./container");
Object.defineProperty(exports, "createInventoryContainer", { enumerable: true, get: function () { return container_1.createInventoryContainer; } });
// Export refactored components for direct usage
var inventory_read_controller_1 = require("./presentation/controllers/inventory-read.controller");
Object.defineProperty(exports, "InventoryReadController", { enumerable: true, get: function () { return inventory_read_controller_1.InventoryReadController; } });
var inventory_write_controller_1 = require("./presentation/controllers/inventory-write.controller");
Object.defineProperty(exports, "InventoryWriteController", { enumerable: true, get: function () { return inventory_write_controller_1.InventoryWriteController; } });
// Export specialized repositories
var inventory_read_repository_1 = require("./infrastructure/repositories/inventory-read.repository");
Object.defineProperty(exports, "InventoryReadRepository", { enumerable: true, get: function () { return inventory_read_repository_1.InventoryReadRepository; } });
var inventory_write_repository_1 = require("./infrastructure/repositories/inventory-write.repository");
Object.defineProperty(exports, "InventoryWriteRepository", { enumerable: true, get: function () { return inventory_write_repository_1.InventoryWriteRepository; } });
// Export domain services and value objects
var inventory_domain_service_1 = require("./domain/services/inventory-domain.service");
Object.defineProperty(exports, "InventoryDomainService", { enumerable: true, get: function () { return inventory_domain_service_1.InventoryDomainService; } });
var stock_quantity_vo_1 = require("./domain/value-objects/stock-quantity.vo");
Object.defineProperty(exports, "StockQuantity", { enumerable: true, get: function () { return stock_quantity_vo_1.StockQuantity; } });
var cost_calculator_vo_1 = require("./domain/value-objects/cost-calculator.vo");
Object.defineProperty(exports, "CostCalculator", { enumerable: true, get: function () { return cost_calculator_vo_1.CostCalculator; } });
// Export application services
var inventory_validator_1 = require("./application/validators/inventory.validator");
Object.defineProperty(exports, "InventoryValidator", { enumerable: true, get: function () { return inventory_validator_1.InventoryValidator; } });
var inventory_mapper_1 = require("./application/mappers/inventory.mapper");
Object.defineProperty(exports, "InventoryMapper", { enumerable: true, get: function () { return inventory_mapper_1.InventoryMapper; } });
// Export specialized use cases
var reserve_stock_usecase_1 = require("./application/use-cases/stock/reserve-stock.usecase");
Object.defineProperty(exports, "ReserveStockUseCase", { enumerable: true, get: function () { return reserve_stock_usecase_1.ReserveStockUseCase; } });
var release_stock_usecase_1 = require("./application/use-cases/stock/release-stock.usecase");
Object.defineProperty(exports, "ReleaseStockUseCase", { enumerable: true, get: function () { return release_stock_usecase_1.ReleaseStockUseCase; } });
// Export legacy components for backward compatibility
var create_inventory_usecase_1 = require("./application/use-cases/create-inventory.usecase");
Object.defineProperty(exports, "CreateInventoryUseCase", { enumerable: true, get: function () { return create_inventory_usecase_1.CreateInventoryUseCase; } });
var get_inventory_by_id_usecase_1 = require("./application/use-cases/get-inventory-by-id.usecase");
Object.defineProperty(exports, "GetInventoryByIdUseCase", { enumerable: true, get: function () { return get_inventory_by_id_usecase_1.GetInventoryByIdUseCase; } });
var get_all_inventories_usecase_1 = require("./application/use-cases/get-all-inventories.usecase");
Object.defineProperty(exports, "GetAllInventoriesUseCase", { enumerable: true, get: function () { return get_all_inventories_usecase_1.GetAllInventoriesUseCase; } });
var update_inventory_usecase_1 = require("./application/use-cases/update-inventory.usecase");
Object.defineProperty(exports, "UpdateInventoryUseCase", { enumerable: true, get: function () { return update_inventory_usecase_1.UpdateInventoryUseCase; } });
var check_availability_usecase_1 = require("./application/use-cases/check-availability.usecase");
Object.defineProperty(exports, "CheckAvailabilityUseCase", { enumerable: true, get: function () { return check_availability_usecase_1.CheckAvailabilityUseCase; } });
// Export domain entities and interfaces
__exportStar(require("./domain/entities/inventory.entity"), exports);
__exportStar(require("./domain/interfaces/inventory-repository.interface"), exports);
// Export DTOs
__exportStar(require("./application/dto/inventory.dto"), exports);
