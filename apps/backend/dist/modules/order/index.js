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
exports.orderRoutes = exports.createOrderContainer = exports.OrderController = void 0;
var order_controller_1 = require("./presentation/controllers/order.controller");
Object.defineProperty(exports, "OrderController", { enumerable: true, get: function () { return order_controller_1.OrderController; } });
var container_1 = require("./container");
Object.defineProperty(exports, "createOrderContainer", { enumerable: true, get: function () { return container_1.createOrderContainer; } });
var routes_1 = require("./routes");
Object.defineProperty(exports, "orderRoutes", { enumerable: true, get: function () { return routes_1.orderModuleRoutes; } });
__exportStar(require("./application/dto"), exports);
__exportStar(require("./domain/entities/order.entity"), exports);
