"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryAlertType = exports.InventoryReferenceType = exports.InventoryMovementType = void 0;
var InventoryMovementType;
(function (InventoryMovementType) {
    InventoryMovementType["STOCK_IN"] = "STOCK_IN";
    InventoryMovementType["STOCK_OUT"] = "STOCK_OUT";
    InventoryMovementType["ADJUSTMENT"] = "ADJUSTMENT";
    InventoryMovementType["RESERVATION"] = "RESERVATION";
    InventoryMovementType["RELEASE"] = "RELEASE";
    InventoryMovementType["TRANSFER"] = "TRANSFER";
    InventoryMovementType["DAMAGE"] = "DAMAGE";
    InventoryMovementType["RETURN"] = "RETURN";
})(InventoryMovementType || (exports.InventoryMovementType = InventoryMovementType = {}));
var InventoryReferenceType;
(function (InventoryReferenceType) {
    InventoryReferenceType["ORDER"] = "ORDER";
    InventoryReferenceType["PURCHASE_ORDER"] = "PURCHASE_ORDER";
    InventoryReferenceType["TRANSFER"] = "TRANSFER";
    InventoryReferenceType["MANUAL"] = "MANUAL";
    InventoryReferenceType["SYSTEM"] = "SYSTEM";
})(InventoryReferenceType || (exports.InventoryReferenceType = InventoryReferenceType = {}));
var InventoryAlertType;
(function (InventoryAlertType) {
    InventoryAlertType["LOW_STOCK"] = "LOW_STOCK";
    InventoryAlertType["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    InventoryAlertType["EXPIRED"] = "EXPIRED";
    InventoryAlertType["NEAR_EXPIRY"] = "NEAR_EXPIRY";
})(InventoryAlertType || (exports.InventoryAlertType = InventoryAlertType = {}));
