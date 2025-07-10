"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostCalculator = void 0;
class CostCalculator {
    _unitCost;
    _averageCost;
    constructor(_unitCost, _averageCost) {
        this._unitCost = _unitCost;
        this._averageCost = _averageCost;
        this.validate();
    }
    static create(unitCost, averageCost) {
        return new CostCalculator(unitCost, averageCost || unitCost);
    }
    get unitCost() {
        return this._unitCost;
    }
    get averageCost() {
        return this._averageCost;
    }
    calculateNewAverageCost(currentQuantity, incomingQuantity, incomingUnitCost) {
        if (currentQuantity === 0) {
            return new CostCalculator(incomingUnitCost, incomingUnitCost);
        }
        const totalValue = currentQuantity * this._averageCost +
            incomingQuantity * incomingUnitCost;
        const totalQuantity = currentQuantity + incomingQuantity;
        const newAverageCost = totalValue / totalQuantity;
        return new CostCalculator(this._unitCost, newAverageCost);
    }
    calculateMovementCost(quantity, unitCost) {
        const costPerUnit = unitCost || this._unitCost;
        return quantity * costPerUnit;
    }
    updateUnitCost(newUnitCost) {
        return new CostCalculator(newUnitCost, this._averageCost);
    }
    validate() {
        if (this._unitCost < 0) {
            throw new Error('Unit cost cannot be negative');
        }
        if (this._averageCost < 0) {
            throw new Error('Average cost cannot be negative');
        }
    }
}
exports.CostCalculator = CostCalculator;
