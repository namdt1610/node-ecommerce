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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const env_1 = require("./config/env");
const dashboard_1 = require("./modules/dashboard");
const PORT = env_1.config.server.port;
const startServer = async () => {
    try {
        // Test database connection
        await database_1.default.$connect();
        console.log('Database connected successfully');
        // Create HTTP server
        const httpServer = (0, http_1.createServer)(app_1.default);
        // Initialize Socket.IO service
        const socketService = (0, dashboard_1.initializeSocketService)(httpServer);
        console.log('Socket.IO service initialized');
        // Get Socket.IO instance for other services
        const io = socketService.getIO();
        // Create dashboard controller with HTTP server
        const dashboardController = (0, dashboard_1.createDashboardController)(httpServer);
        // Inject dashboard controller into app for routes
        app_1.default.use('/api/dashboard', (req, res, next) => {
            req.dashboardController = dashboardController;
            next();
        });
        // Initialize routes with Socket.IO instance
        const { registerAllRoutes } = await Promise.resolve().then(() => __importStar(require('./routes')));
        registerAllRoutes(app_1.default, io);
        console.log('Dashboard service initialized');
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Socket.IO endpoint: ws://localhost:${PORT}/socket.io`);
            console.log(`Dashboard API: http://localhost:${PORT}/api/dashboard`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await database_1.default.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await database_1.default.$disconnect();
    process.exit(0);
});
startServer();
