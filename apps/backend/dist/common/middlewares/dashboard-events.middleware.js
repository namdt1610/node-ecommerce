"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardEventsMiddleware = dashboardEventsMiddleware;
const dashboard_1 = require("../../modules/dashboard");
function dashboardEventsMiddleware(eventData) {
    return (req, res, next) => {
        // Store original send function
        const originalSend = res.send;
        // Override send function to trigger dashboard update after response
        res.send = function (data) {
            // Call original send
            const result = originalSend.call(this, data);
            // Trigger dashboard update if response was successful
            if (res.statusCode >= 200 && res.statusCode < 300) {
                triggerDashboardUpdate(eventData, data);
            }
            return result;
        };
        next();
    };
}
function triggerDashboardUpdate(eventData, responseData) {
    const socketService = (0, dashboard_1.getSocketService)();
    if (!socketService) {
        return; // Socket service not initialized
    }
    try {
        // Parse response data
        let parsedData = responseData;
        if (typeof responseData === 'string') {
            try {
                parsedData = JSON.parse(responseData);
            }
            catch (e) {
                // Not JSON, skip
                return;
            }
        }
        // Send notification based on event type
        switch (eventData.type) {
            case 'order':
                socketService.emitNotification({
                    title: 'New Order',
                    message: getOrderMessage(eventData.action, parsedData),
                    type: eventData.action === 'created' ? 'success' : 'info',
                    data: eventData.data,
                });
                break;
            case 'user':
                socketService.emitNotification({
                    title: 'User Activity',
                    message: getUserMessage(eventData.action, parsedData),
                    type: 'info',
                    data: eventData.data,
                });
                break;
            case 'product':
                socketService.emitNotification({
                    title: 'Product Update',
                    message: getProductMessage(eventData.action, parsedData),
                    type: 'info',
                    data: eventData.data,
                });
                break;
            case 'payment':
                socketService.emitNotification({
                    title: 'Payment Activity',
                    message: getPaymentMessage(eventData.action, parsedData),
                    type: eventData.action === 'created' ? 'success' : 'warning',
                    data: eventData.data,
                });
                break;
        }
        // Trigger stats refresh after a delay to avoid too frequent updates
        setTimeout(() => {
            socketService.emitNotification({
                title: 'Dashboard Update',
                message: 'Statistics have been updated',
                type: 'info',
            });
        }, 2000);
    }
    catch (error) {
        console.error('Error triggering dashboard update:', error);
    }
}
function getOrderMessage(action, data) {
    switch (action) {
        case 'created':
            return `New order created: #${data.data?.id?.slice(0, 8) || 'unknown'}`;
        case 'updated':
            return `Order updated: #${data.data?.id?.slice(0, 8) || 'unknown'}`;
        case 'deleted':
            return `Order cancelled: #${data.data?.id?.slice(0, 8) || 'unknown'}`;
        default:
            return 'Order activity detected';
    }
}
function getUserMessage(action, data) {
    switch (action) {
        case 'created':
            return `New user registered: ${data.data?.name || data.data?.email || 'unknown'}`;
        case 'updated':
            return `User profile updated: ${data.data?.name || data.data?.email || 'unknown'}`;
        case 'deleted':
            return `User account deleted`;
        default:
            return 'User activity detected';
    }
}
function getProductMessage(action, data) {
    switch (action) {
        case 'created':
            return `New product added: ${data.data?.name || 'unknown'}`;
        case 'updated':
            return `Product updated: ${data.data?.name || 'unknown'}`;
        case 'deleted':
            return `Product removed: ${data.data?.name || 'unknown'}`;
        default:
            return 'Product activity detected';
    }
}
function getPaymentMessage(action, data) {
    switch (action) {
        case 'created':
            return `Payment intent created: $${data.data?.amount || 'unknown'}`;
        case 'updated':
            return `Payment status updated`;
        case 'deleted':
            return `Payment refunded`;
        default:
            return 'Payment activity detected';
    }
}
