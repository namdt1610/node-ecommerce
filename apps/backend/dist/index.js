"use strict";
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
        // Create dashboard controller with HTTP server
        const dashboardController = (0, dashboard_1.createDashboardController)(httpServer);
        // Inject dashboard controller into app for routes
        app_1.default.use('/api/dashboard', (req, res, next) => {
            req.dashboardController = dashboardController;
            next();
        });
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
