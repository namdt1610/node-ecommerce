"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrderData = exports.debugValue = exports.validateId = exports.validateUUID = exports.isValidId = exports.isValidCUID = exports.isValidUUID = void 0;
// UUID validation utilities
const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
exports.isValidUUID = isValidUUID;
// CUID validation utilities (for Prisma generated IDs)
const isValidCUID = (cuid) => {
    // CUID format: c + timestamp + counter + random + fingerprint
    // Example: cmcumcf7o000k9ff02gkzr89v
    const cuidRegex = /^c[0-9a-z]{24}$/i;
    return cuidRegex.test(cuid);
};
exports.isValidCUID = isValidCUID;
// Combined ID validation (supports both UUID and CUID)
const isValidId = (id) => {
    return (0, exports.isValidUUID)(id) || (0, exports.isValidCUID)(id);
};
exports.isValidId = isValidId;
const validateUUID = (value, fieldName) => {
    if (!value) {
        throw new Error(`${fieldName} is required`);
    }
    if (typeof value !== 'string') {
        throw new Error(`${fieldName} must be a string, received: ${typeof value}`);
    }
    if (!(0, exports.isValidUUID)(value)) {
        throw new Error(`${fieldName} must be a valid UUID, received: ${value}`);
    }
    return value;
};
exports.validateUUID = validateUUID;
const validateId = (value, fieldName) => {
    if (!value) {
        throw new Error(`${fieldName} is required`);
    }
    if (typeof value !== 'string') {
        throw new Error(`${fieldName} must be a string, received: ${typeof value}`);
    }
    if (!(0, exports.isValidId)(value)) {
        throw new Error(`${fieldName} must be a valid ID, received: ${value}`);
    }
    return value;
};
exports.validateId = validateId;
const debugValue = (value, fieldName) => {
    console.log(`=== DEBUG ${fieldName} ===`, {
        value,
        type: typeof value,
        length: typeof value === 'string' ? value.length : 'N/A',
        isValidUUID: typeof value === 'string' ? (0, exports.isValidUUID)(value) : false,
        isValidCUID: typeof value === 'string' ? (0, exports.isValidCUID)(value) : false,
        isValidId: typeof value === 'string' ? (0, exports.isValidId)(value) : false,
    });
};
exports.debugValue = debugValue;
// Order validation helpers
const validateOrderData = (data) => {
    console.log('=== VALIDATING ORDER DATA ===', data);
    if (!data) {
        throw new Error('Order data is required');
    }
    if (!data.userId) {
        throw new Error('User ID is required');
    }
    (0, exports.debugValue)(data.userId, 'userId');
    (0, exports.validateId)(data.userId, 'userId');
    if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Items array is required');
    }
    if (data.items.length === 0) {
        throw new Error('At least one item is required');
    }
    data.items.forEach((item, index) => {
        console.log(`=== VALIDATING ITEM ${index} ===`, item);
        if (!item.productId) {
            throw new Error(`Item ${index}: productId is required`);
        }
        (0, exports.debugValue)(item.productId, `items.${index}.productId`);
        (0, exports.validateId)(item.productId, `items.${index}.productId`);
        if (!item.quantity ||
            typeof item.quantity !== 'number' ||
            item.quantity <= 0) {
            throw new Error(`Item ${index}: quantity must be a positive number`);
        }
        if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
            throw new Error(`Item ${index}: price must be a positive number`);
        }
    });
};
exports.validateOrderData = validateOrderData;
