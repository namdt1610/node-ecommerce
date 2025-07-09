"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentType = exports.ShippingStatus = exports.PaymentStatus = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["RETURNED"] = "RETURNED";
    OrderStatus["REFUNDED"] = "REFUNDED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["AUTHORIZED"] = "AUTHORIZED";
    PaymentStatus["CAPTURED"] = "CAPTURED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var ShippingStatus;
(function (ShippingStatus) {
    ShippingStatus["NOT_SHIPPED"] = "NOT_SHIPPED";
    ShippingStatus["PREPARING"] = "PREPARING";
    ShippingStatus["SHIPPED"] = "SHIPPED";
    ShippingStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ShippingStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    ShippingStatus["DELIVERED"] = "DELIVERED";
    ShippingStatus["DELIVERY_FAILED"] = "DELIVERY_FAILED";
})(ShippingStatus || (exports.ShippingStatus = ShippingStatus = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentType["DEBIT_CARD"] = "DEBIT_CARD";
    PaymentType["PAYPAL"] = "PAYPAL";
    PaymentType["APPLE_PAY"] = "APPLE_PAY";
    PaymentType["GOOGLE_PAY"] = "GOOGLE_PAY";
    PaymentType["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentType["CASH_ON_DELIVERY"] = "CASH_ON_DELIVERY";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
