"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeType = exports.ProductStatus = exports.ProductCondition = exports.ProductType = void 0;
var ProductType;
(function (ProductType) {
    ProductType["SMARTPHONE"] = "SMARTPHONE";
    ProductType["LAPTOP"] = "LAPTOP";
    ProductType["TABLET"] = "TABLET";
    ProductType["ACCESSORIES"] = "ACCESSORIES";
    ProductType["AUDIO"] = "AUDIO";
    ProductType["WEARABLE"] = "WEARABLE";
    ProductType["GAMING"] = "GAMING";
    ProductType["SOFTWARE"] = "SOFTWARE";
    ProductType["SERVICES"] = "SERVICES";
})(ProductType || (exports.ProductType = ProductType = {}));
var ProductCondition;
(function (ProductCondition) {
    ProductCondition["NEW"] = "NEW";
    ProductCondition["LIKE_NEW"] = "LIKE_NEW";
    ProductCondition["GOOD"] = "GOOD";
    ProductCondition["FAIR"] = "FAIR";
    ProductCondition["REFURBISHED"] = "REFURBISHED";
})(ProductCondition || (exports.ProductCondition = ProductCondition = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["ACTIVE"] = "ACTIVE";
    ProductStatus["INACTIVE"] = "INACTIVE";
    ProductStatus["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    ProductStatus["DISCONTINUED"] = "DISCONTINUED";
    ProductStatus["COMING_SOON"] = "COMING_SOON";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var AttributeType;
(function (AttributeType) {
    AttributeType["TEXT"] = "TEXT";
    AttributeType["NUMBER"] = "NUMBER";
    AttributeType["SELECT"] = "SELECT";
    AttributeType["MULTI_SELECT"] = "MULTI_SELECT";
    AttributeType["COLOR"] = "COLOR";
    AttributeType["SIZE"] = "SIZE";
    AttributeType["BOOLEAN"] = "BOOLEAN";
})(AttributeType || (exports.AttributeType = AttributeType = {}));
