"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAllRoutes = registerAllRoutes;
const auth_1 = require("./modules/auth");
const user_1 = require("./modules/user");
const category_1 = require("./modules/category");
const product_1 = require("./modules/product");
const order_1 = require("./modules/order");
const admin_routes_1 = require("./modules/order/routes/admin.routes");
const container_1 = require("./modules/order/container");
const cart_1 = require("./modules/cart");
const payment_1 = require("./modules/payment");
const dashboard_1 = require("./modules/dashboard");
const inventory_1 = require("./modules/inventory");
const reviews_1 = __importDefault(require("./routes/reviews"));
function registerAllRoutes(app, io) {
    // API Routes - core modules
    app.use('/api/auth', (0, auth_1.authRoutes)());
    app.use('/api/users', (0, user_1.userRoutes)());
    app.use('/api/categories', category_1.categoryRoutes);
    app.use('/api/products', (0, product_1.productRoutes)());
    app.use('/api/orders', (0, order_1.orderRoutes)(io));
    app.use('/api/cart', (0, cart_1.cartRoutes)());
    app.use('/api/payments', (0, payment_1.paymentRoutes)());
    app.use('/api/dashboard', (0, dashboard_1.dashboardRoutes)());
    app.use('/api/inventory', (0, inventory_1.inventoryModuleRoutes)());
    app.use('/api/reviews', reviews_1.default);
    // Admin routes (require admin role)
    if (io) {
        const orderContainer = (0, container_1.createOrderContainer)(io);
        app.use('/api/admin/orders', (0, admin_routes_1.createOrderAdminRoutes)(orderContainer.orderController));
    }
}
