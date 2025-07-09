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
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class SocketService {
    io;
    connectedAdmins = new Set();
    constructor(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: ['http://localhost:3000', 'http://localhost:3001'],
                methods: ['GET', 'POST'],
                credentials: true,
            },
            path: '/socket.io',
        });
        this.setupMiddleware();
        this.setupEventHandlers();
    }
    setupMiddleware() {
        // Authentication middleware for socket connections
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication error: No token provided'));
                }
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                // Get user with role from database
                const { UserRepository } = await Promise.resolve().then(() => __importStar(require('../../../user/user.repository')));
                const userRepository = new UserRepository();
                const user = await userRepository.findById(decoded.userId);
                if (!user || !user.role) {
                    return next(new Error('Authentication error: User not found or role not found'));
                }
                // Check if user has admin role
                const userRole = user.role.name?.toLowerCase();
                if (userRole !== 'admin') {
                    return next(new Error(`Authorization error: Admin access required. Current role: ${userRole}`));
                }
                socket.data.userId = user.id;
                socket.data.userRole = userRole;
                socket.data.isAdmin = true;
                next();
            }
            catch (error) {
                next(new Error('Authentication error: Invalid token'));
            }
        });
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`Admin connected: ${socket.data.userId}`);
            this.connectedAdmins.add(socket.data.userId);
            // Join admin room for dashboard updates
            socket.join('admin-dashboard');
            // Send initial dashboard data
            socket.emit('dashboard:connected', {
                message: 'Connected to admin dashboard',
                timestamp: new Date(),
            });
            // Handle admin requesting specific data
            socket.on('dashboard:request-stats', () => {
                this.emitToSocket(socket, 'dashboard:stats-requested', {});
            });
            socket.on('dashboard:request-sales', (data) => {
                this.emitToSocket(socket, 'dashboard:sales-requested', data);
            });
            socket.on('dashboard:request-users', () => {
                this.emitToSocket(socket, 'dashboard:users-requested', {});
            });
            socket.on('dashboard:request-products', () => {
                this.emitToSocket(socket, 'dashboard:products-requested', {});
            });
            socket.on('dashboard:request-activity', () => {
                this.emitToSocket(socket, 'dashboard:activity-requested', {});
            });
            // Handle disconnect
            socket.on('disconnect', () => {
                console.log(`Admin disconnected: ${socket.data.userId}`);
                this.connectedAdmins.delete(socket.data.userId);
            });
        });
    }
    // Emit updates to all connected admins
    emitDashboardUpdate(updateData) {
        this.io.to('admin-dashboard').emit('dashboard:update', updateData);
    }
    // Emit stats update
    emitStatsUpdate(stats) {
        this.emitDashboardUpdate({
            type: 'stats',
            data: stats,
            timestamp: new Date(),
        });
    }
    // Emit sales analytics update
    emitSalesUpdate(salesData) {
        this.emitDashboardUpdate({
            type: 'sales',
            data: salesData,
            timestamp: new Date(),
        });
    }
    // Emit user analytics update
    emitUsersUpdate(userData) {
        this.emitDashboardUpdate({
            type: 'users',
            data: userData,
            timestamp: new Date(),
        });
    }
    // Emit product analytics update
    emitProductsUpdate(productData) {
        this.emitDashboardUpdate({
            type: 'products',
            data: productData,
            timestamp: new Date(),
        });
    }
    // Emit activity update
    emitActivityUpdate(activity) {
        this.emitDashboardUpdate({
            type: 'activity',
            data: activity,
            timestamp: new Date(),
        });
    }
    // Emit notification to admins
    emitNotification(notification) {
        this.io.to('admin-dashboard').emit('dashboard:notification', {
            ...notification,
            timestamp: new Date(),
        });
    }
    // Private method to emit to specific socket
    emitToSocket(socket, event, data) {
        socket.emit(event, {
            ...data,
            timestamp: new Date(),
        });
    }
    // Get connected admins count
    getConnectedAdminsCount() {
        return this.connectedAdmins.size;
    }
    // Get Socket.IO instance for external use
    getIO() {
        return this.io;
    }
}
exports.SocketService = SocketService;
