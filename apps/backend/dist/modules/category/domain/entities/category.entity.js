"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_TEMPLATES = exports.AttributeType = void 0;
const product_entity_1 = require("../../../product/domain/entities/product.entity");
var AttributeType;
(function (AttributeType) {
    AttributeType["TEXT"] = "TEXT";
    AttributeType["NUMBER"] = "NUMBER";
    AttributeType["SELECT"] = "SELECT";
    AttributeType["MULTI_SELECT"] = "MULTI_SELECT";
    AttributeType["COLOR"] = "COLOR";
    AttributeType["SIZE"] = "SIZE";
    AttributeType["BOOLEAN"] = "BOOLEAN";
    AttributeType["RANGE"] = "RANGE";
    AttributeType["DATE"] = "DATE";
})(AttributeType || (exports.AttributeType = AttributeType = {}));
// Pre-defined category templates
exports.CATEGORY_TEMPLATES = [
    {
        productType: product_entity_1.ProductType.SMARTPHONE,
        name: 'Smartphones',
        description: 'Mobile phones and smartphones from various brands',
        requiredAttributes: [
            {
                name: 'Brand',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: false,
                displayOrder: 1,
                group: 'Basic',
            },
            {
                name: 'Storage',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: true,
                displayOrder: 2,
                group: 'Technical',
                options: [
                    { value: '64GB', label: '64GB', displayOrder: 1 },
                    { value: '128GB', label: '128GB', displayOrder: 2 },
                    { value: '256GB', label: '256GB', displayOrder: 3 },
                    { value: '512GB', label: '512GB', displayOrder: 4 },
                    { value: '1TB', label: '1TB', displayOrder: 5 },
                ],
            },
            {
                name: 'Color',
                type: AttributeType.COLOR,
                isRequired: true,
                isFilterable: true,
                isVariant: true,
                displayOrder: 3,
                group: 'Appearance',
            },
        ],
        optionalAttributes: [
            {
                name: 'Network',
                type: AttributeType.MULTI_SELECT,
                isRequired: false,
                isFilterable: true,
                isVariant: false,
                displayOrder: 4,
                group: 'Technical',
                options: [
                    { value: '5G', label: '5G', displayOrder: 1 },
                    { value: '4G', label: '4G LTE', displayOrder: 2 },
                    { value: '3G', label: '3G', displayOrder: 3 },
                ],
            },
            {
                name: 'Screen Size',
                type: AttributeType.RANGE,
                isRequired: false,
                isFilterable: true,
                isVariant: false,
                displayOrder: 5,
                group: 'Display',
                validation: { min: 4, max: 8 },
            },
        ],
        specifications: [
            {
                name: 'Display Size',
                description: 'Screen diagonal size in inches',
                group: 'Display',
                dataType: 'string',
                unit: 'inch',
                isRequired: true,
                displayOrder: 1,
            },
            {
                name: 'Resolution',
                description: 'Screen resolution in pixels',
                group: 'Display',
                dataType: 'string',
                isRequired: true,
                displayOrder: 2,
            },
            {
                name: 'Processor',
                description: 'Main processor/chipset',
                group: 'Performance',
                dataType: 'string',
                isRequired: true,
                displayOrder: 3,
            },
            {
                name: 'RAM',
                description: 'System memory',
                group: 'Performance',
                dataType: 'string',
                unit: 'GB',
                isRequired: true,
                displayOrder: 4,
            },
            {
                name: 'Battery Capacity',
                description: 'Battery capacity',
                group: 'Battery',
                dataType: 'string',
                unit: 'mAh',
                isRequired: false,
                displayOrder: 5,
            },
        ],
        metadata: {
            seasonality: 'ALL_YEAR',
            targetAudience: [
                'tech-enthusiasts',
                'general-consumers',
                'business-users',
            ],
        },
    },
    {
        productType: product_entity_1.ProductType.LAPTOP,
        name: 'Laptops',
        description: 'Portable computers and laptops',
        requiredAttributes: [
            {
                name: 'Brand',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: false,
                displayOrder: 1,
                group: 'Basic',
            },
            {
                name: 'Processor',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: false,
                displayOrder: 2,
                group: 'Performance',
            },
            {
                name: 'RAM',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: true,
                displayOrder: 3,
                group: 'Performance',
            },
            {
                name: 'Storage',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: true,
                displayOrder: 4,
                group: 'Storage',
            },
        ],
        optionalAttributes: [
            {
                name: 'Graphics Card',
                type: AttributeType.SELECT,
                isRequired: false,
                isFilterable: true,
                isVariant: false,
                displayOrder: 5,
                group: 'Performance',
            },
            {
                name: 'Screen Size',
                type: AttributeType.SELECT,
                isRequired: false,
                isFilterable: true,
                isVariant: false,
                displayOrder: 6,
                group: 'Display',
                options: [
                    { value: '13', label: '13 inch', displayOrder: 1 },
                    { value: '14', label: '14 inch', displayOrder: 2 },
                    { value: '15', label: '15 inch', displayOrder: 3 },
                    { value: '16', label: '16 inch', displayOrder: 4 },
                    { value: '17', label: '17 inch', displayOrder: 5 },
                ],
            },
        ],
        specifications: [
            {
                name: 'Display',
                description: 'Screen specifications',
                group: 'Display',
                dataType: 'string',
                isRequired: true,
                displayOrder: 1,
            },
            {
                name: 'Processor Details',
                description: 'Detailed processor information',
                group: 'Performance',
                dataType: 'string',
                isRequired: true,
                displayOrder: 2,
            },
            {
                name: 'Battery Life',
                description: 'Expected battery life',
                group: 'Battery',
                dataType: 'string',
                unit: 'hours',
                isRequired: false,
                displayOrder: 3,
            },
        ],
        metadata: {
            seasonality: 'ALL_YEAR',
            targetAudience: [
                'students',
                'professionals',
                'gamers',
                'content-creators',
            ],
        },
    },
];
