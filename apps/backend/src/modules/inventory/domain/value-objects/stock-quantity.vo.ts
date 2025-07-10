export class StockQuantity {
    private constructor(
        private readonly _total: number,
        private readonly _available: number,
        private readonly _reserved: number
    ) {
        this.validate()
    }

    static create(
        total: number,
        available: number,
        reserved: number
    ): StockQuantity {
        return new StockQuantity(total, available, reserved)
    }

    static fromTotal(total: number): StockQuantity {
        return new StockQuantity(total, total, 0)
    }

    get total(): number {
        return this._total
    }
    get available(): number {
        return this._available
    }
    get reserved(): number {
        return this._reserved
    }

    reserve(quantity: number): StockQuantity {
        if (quantity > this._available) {
            throw new Error('Cannot reserve more than available quantity')
        }

        return new StockQuantity(
            this._total,
            this._available - quantity,
            this._reserved + quantity
        )
    }

    release(quantity: number): StockQuantity {
        if (quantity > this._reserved) {
            throw new Error('Cannot release more than reserved quantity')
        }

        return new StockQuantity(
            this._total,
            this._available + quantity,
            this._reserved - quantity
        )
    }

    addStock(quantity: number): StockQuantity {
        return new StockQuantity(
            this._total + quantity,
            this._available + quantity,
            this._reserved
        )
    }

    removeStock(quantity: number): StockQuantity {
        if (quantity > this._available) {
            throw new Error('Cannot remove more than available quantity')
        }

        return new StockQuantity(
            this._total - quantity,
            this._available - quantity,
            this._reserved
        )
    }

    adjustTo(newTotal: number): StockQuantity {
        const difference = newTotal - this._total
        return new StockQuantity(
            newTotal,
            Math.max(0, this._available + difference),
            this._reserved
        )
    }

    private validate(): void {
        if (this._total < 0) {
            throw new Error('Total quantity cannot be negative')
        }
        if (this._available < 0) {
            throw new Error('Available quantity cannot be negative')
        }
        if (this._reserved < 0) {
            throw new Error('Reserved quantity cannot be negative')
        }
        if (this._available + this._reserved !== this._total) {
            throw new Error('Available + Reserved must equal Total quantity')
        }
    }
}
