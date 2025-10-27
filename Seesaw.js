import { Weight } from './Weight.js';

export class Seesaw {
    static AngleLimit = 30;

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

    addWeight(weightAsKg, positionX) {
        const weight = new Weight(
            weightAsKg,
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

    updatePlank() {
        const torqueDiff = this.rightTorque - this.leftTorque;
        const targetAngle = Math.max(
            -Seesaw.AngleLimit,
            Math.min(Seesaw.AngleLimit, torqueDiff / 10)
        );

        this.currentAngle += (targetAngle - this.currentAngle) * 0.1;

        const rotateTransform = `translateX(-50%) translateY(-50%) rotate(${this.currentAngle}deg)`;
        this.plankElement.style.transform = rotateTransform;
    }

    updateWeights() {
        this.weights.forEach((weight) => {
            if (!weight.falling) {
                weight.updatePosition(this.currentAngle);
            }
        });
    }

    animateWeights() {
        this.weights.forEach((weight) => {
            weight.animate(this.currentAngle);
        });
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