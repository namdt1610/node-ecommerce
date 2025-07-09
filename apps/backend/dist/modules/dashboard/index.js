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
exports.SocketService = exports.initializeSocketService = exports.getSocketService = exports.createDashboardController = exports.createDashboardRoutesWithController = exports.dashboardRoutes = void 0;
// Export dashboard routes
var routes_1 = require("./routes");
Object.defineProperty(exports, "dashboardRoutes", { enumerable: true, get: function () { return routes_1.dashboardModuleRoutes; } });
Object.defineProperty(exports, "createDashboardRoutesWithController", { enumerable: true, get: function () { return routes_1.createDashboardRoutesWithController; } });
// Export dashboard controller for testing
var container_1 = require("./container");
Object.defineProperty(exports, "createDashboardController", { enumerable: true, get: function () { return container_1.createDashboardController; } });
Object.defineProperty(exports, "getSocketService", { enumerable: true, get: function () { return container_1.getSocketService; } });
Object.defineProperty(exports, "initializeSocketService", { enumerable: true, get: function () { return container_1.initializeSocketService; } });
// Export interfaces
__exportStar(require("./domain/interfaces/dashboard-repository.interface"), exports);
__exportStar(require("./domain/interfaces/dashboard-container"), exports);
// Export socket service
var socket_service_1 = require("./infrastructure/services/socket.service");
Object.defineProperty(exports, "SocketService", { enumerable: true, get: function () { return socket_service_1.SocketService; } });
