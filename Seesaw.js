import { Weight } from './Weight.js';

export class Seesaw {
    static MAX_ANGLE = 30;

    constructor(plankElement, containerElement) {
        this.plankElement = plankElement;
        this.containerElement = containerElement;
        this.currentAngle = 0;
        this.weights = [];
        this.leftTorque = 0;
        this.rightTorque = 0;
        this.leftWeight = 0;
        this.rightWeight = 0;
    }

    addWeight(nextWeight, positionX) {
        const weight = new Weight(
            nextWeight,
            positionX,
            this.containerElement,
            this.currentAngle
        );

        this.weights.push(weight);
        const torque = weight.getTorque();

        if (weight.side === 'left') {
            this.leftTorque += torque;
            this.leftWeight += weight.mass;
        } else {
            this.rightTorque += torque;
            this.rightWeight += weight.mass;
        }

        return weight;
    }


    reset() {
        this.weights.forEach((weight) => weight.remove());
        this.weights = [];
        this.currentAngle = 0;
        this.leftTorque = 0;
        this.rightTorque = 0;
        this.leftWeight = 0;
        this.rightWeight = 0;
        Weight.idCounter = 0;
    }

    getStats() {
        return {
            leftWeight: this.leftWeight,
            rightWeight: this.rightWeight,
            angle: this.currentAngle
        };
    }
}