"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHasher = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class BcryptHasher {
    async hash(plain) {
        return await bcryptjs_1.default.hash(plain, 12);
    }
    async verify(plain, hash) {
        return await bcryptjs_1.default.compare(plain, hash);
    }
}
exports.BcryptHasher = BcryptHasher;
