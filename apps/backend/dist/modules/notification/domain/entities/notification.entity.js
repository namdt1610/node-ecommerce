"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationChannel = exports.NotificationPriority = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["ORDER_CREATED"] = "ORDER_CREATED";
    NotificationType["ORDER_CONFIRMED"] = "ORDER_CONFIRMED";
    NotificationType["ORDER_SHIPPED"] = "ORDER_SHIPPED";
    NotificationType["ORDER_DELIVERED"] = "ORDER_DELIVERED";
    NotificationType["ORDER_CANCELLED"] = "ORDER_CANCELLED";
    NotificationType["PAYMENT_SUCCESS"] = "PAYMENT_SUCCESS";
    NotificationType["PAYMENT_FAILED"] = "PAYMENT_FAILED";
    NotificationType["PRODUCT_BACK_IN_STOCK"] = "PRODUCT_BACK_IN_STOCK";
    NotificationType["PRICE_DROP"] = "PRICE_DROP";
    NotificationType["NEW_PRODUCT_LAUNCH"] = "NEW_PRODUCT_LAUNCH";
    NotificationType["PROMOTION"] = "PROMOTION";
    NotificationType["REVIEW_REQUEST"] = "REVIEW_REQUEST";
    NotificationType["ACCOUNT_UPDATE"] = "ACCOUNT_UPDATE";
    NotificationType["SECURITY_ALERT"] = "SECURITY_ALERT";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "LOW";
    NotificationPriority["MEDIUM"] = "MEDIUM";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["URGENT"] = "URGENT";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "IN_APP";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["PUSH"] = "PUSH";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
