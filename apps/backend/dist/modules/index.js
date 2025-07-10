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
exports.createInventoryContainer = exports.inventoryModuleRoutes = exports.createProductController = exports.productModuleRoutes = void 0;
__exportStar(require("./auth"), exports);
__exportStar(require("./user"), exports);
__exportStar(require("./category"), exports);
__exportStar(require("./order"), exports);
// Product module exports (excluding conflicting types)
var product_1 = require("./product");
Object.defineProperty(exports, "productModuleRoutes", { enumerable: true, get: function () { return product_1.productRoutes; } });
var product_2 = require("./product");
Object.defineProperty(exports, "createProductController", { enumerable: true, get: function () { return product_2.createProductController; } });
// Inventory module exports
var inventory_1 = require("./inventory");
Object.defineProperty(exports, "inventoryModuleRoutes", { enumerable: true, get: function () { return inventory_1.inventoryModuleRoutes; } });
var inventory_2 = require("./inventory");
Object.defineProperty(exports, "createInventoryContainer", { enumerable: true, get: function () { return inventory_2.createInventoryContainer; } });
