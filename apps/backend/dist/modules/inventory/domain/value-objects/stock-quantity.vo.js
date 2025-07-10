"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockQuantity = void 0;
class StockQuantity {
    _total;
    _available;
    _reserved;
    constructor(_total, _available, _reserved) {
        this._total = _total;
        this._available = _available;
        this._reserved = _reserved;
        this.validate();
    }
    static create(total, available, reserved) {
        return new StockQuantity(total, available, reserved);
    }
    static fromTotal(total) {
        return new StockQuantity(total, total, 0);
    }
    get total() {
        return this._total;
    }
    get available() {
        return this._available;
    }
    get reserved() {
        return this._reserved;
    }
    reserve(quantity) {
        if (quantity > this._available) {
            throw new Error('Cannot reserve more than available quantity');
        }
        return new StockQuantity(this._total, this._available - quantity, this._reserved + quantity);
    }
    release(quantity) {
        if (quantity > this._reserved) {
            throw new Error('Cannot release more than reserved quantity');
        }
        return new StockQuantity(this._total, this._available + quantity, this._reserved - quantity);
    }
    addStock(quantity) {
        return new StockQuantity(this._total + quantity, this._available + quantity, this._reserved);
    }
    removeStock(quantity) {
        if (quantity > this._available) {
            throw new Error('Cannot remove more than available quantity');
        }
        return new StockQuantity(this._total - quantity, this._available - quantity, this._reserved);
    }
    adjustTo(newTotal) {
        const difference = newTotal - this._total;
        return new StockQuantity(newTotal, Math.max(0, this._available + difference), this._reserved);
    }
    validate() {
        if (this._total < 0) {
            throw new Error('Total quantity cannot be negative');
        }
        if (this._available < 0) {
            throw new Error('Available quantity cannot be negative');
        }
        if (this._reserved < 0) {
            throw new Error('Reserved quantity cannot be negative');
        }
        if (this._available + this._reserved !== this._total) {
            throw new Error('Available + Reserved must equal Total quantity');
        }
    }
}
exports.StockQuantity = StockQuantity;
