export class CostCalculator {
    private constructor(
        private readonly _unitCost: number,
        private readonly _averageCost: number
    ) {
        this.validate()
    }

    static create(unitCost: number, averageCost?: number): CostCalculator {
        return new CostCalculator(unitCost, averageCost || unitCost)
    }

    get unitCost(): number {
        return this._unitCost
    }
    get averageCost(): number {
        return this._averageCost
    }

    calculateNewAverageCost(
        currentQuantity: number,
        incomingQuantity: number,
        incomingUnitCost: number
    ): CostCalculator {
        if (currentQuantity === 0) {
            return new CostCalculator(incomingUnitCost, incomingUnitCost)
        }

        const totalValue =
            currentQuantity * this._averageCost +
            incomingQuantity * incomingUnitCost
        const totalQuantity = currentQuantity + incomingQuantity
        const newAverageCost = totalValue / totalQuantity

        return new CostCalculator(this._unitCost, newAverageCost)
    }

    calculateMovementCost(quantity: number, unitCost?: number): number {
        const costPerUnit = unitCost || this._unitCost
        return quantity * costPerUnit
    }

    updateUnitCost(newUnitCost: number): CostCalculator {
        return new CostCalculator(newUnitCost, this._averageCost)
    }

    private validate(): void {
        if (this._unitCost < 0) {
            throw new Error('Unit cost cannot be negative')
        }
        if (this._averageCost < 0) {
            throw new Error('Average cost cannot be negative')
        }
    }
}
