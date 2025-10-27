import { Seesaw } from './Seesaw.js';
import { Weight } from './Weight.js';

export class Simulation {
    static instance = null;
    static PlankLength = 400;
    static ContainerWidth = 800;
    static ContainerHeight = 500;

    constructor() {
        if (Simulation.instance) {
            return Simulation.instance;
        }

        this.seesawPlank = document.getElementById('seesawPlank');
        this.seesawClickable = document.getElementById('seesawClickable');
        this.seesawContainer = document.getElementById('seesawContainer');
        this.resetBtn = document.getElementById('resetBtn');

        this.seesaw = new Seesaw(this.seesawPlank, this.seesawContainer);
        this.nextWeight = this.generateRandomWeight();
        this.previewElement = null;
        this.previewLineElement = null;

        this.setupEventListeners();
        this.start();

        Simulation.instance = this;
    }

    static getInstance() {
        if (!Simulation.instance) {
            Simulation.instance = new Simulation();
        }
        return Simulation.instance;
    }

    generateRandomWeight() {
        return Math.floor(Math.random() * 10) + 1;
    }

    setupEventListeners() {
        this.seesawClickable.addEventListener('click', (e) => {
            e.stopPropagation();
            const positionX = this.getConstrainedPosition(e);
            this.dropWeight(positionX);
            this.removePreview();
            this.saveState();
        });

        this.seesawClickable.addEventListener('mousemove', (e) => {
            e.stopPropagation();
            const positionX = this.getConstrainedPosition(e);
            this.showPreview(positionX);
        });

        this.seesawClickable.addEventListener('mouseleave', () => {
            this.removePreview();
        });

        this.resetBtn.addEventListener('click', () => {
            this.reset();
        });
    }


    getConstrainedPosition(e) {
        const containerRect = this.seesawContainer.getBoundingClientRect();
        const clickX = e.clientX - containerRect.left - Simulation.ContainerWidth / 2;
        return Math.max(-Simulation.PlankLength / 2, Math.min(Simulation.PlankLength / 2, clickX));
    }

    dropWeight(positionX) {
        const weight = this.seesaw.addWeight(this.nextWeight, positionX);

        this.addLogEntry(
            `📦 ${weight.mass}kg dropped on ${weight.side} side at ${weight.distance.toFixed(0)}px from center`
        );

        this.nextWeight = this.generateRandomWeight();
        this.updateStats();
    }

    showPreview(positionX) {
        this.removePreview();

        const size = 15 + this.nextWeight * 2;

        this.previewElement = document.createElement('div');
        this.previewElement.className = 'preview-object';
        this.previewElement.style.width = `${size * 2}px`;
        this.previewElement.style.height = `${size * 2}px`;
        this.previewElement.style.background = '#3498db';
        this.previewElement.style.left = `${Simulation.ContainerWidth / 2 + positionX - size}px`;
        this.previewElement.style.top = `${Simulation.ContainerHeight / 2 - 80}px`;
        this.previewElement.textContent = `${this.nextWeight}kg`;

        this.previewLineElement = document.createElement('div');
        this.previewLineElement.className = 'preview-line';
        this.previewLineElement.style.left = `${Simulation.ContainerWidth / 2 + positionX}px`;
        this.previewLineElement.style.top = `${Simulation.ContainerHeight / 2 - 80 + size}px`;
        this.previewLineElement.style.height = `${80 - size}px`;

        this.seesawContainer.appendChild(this.previewElement);
        this.seesawContainer.appendChild(this.previewLineElement);
    }

    removePreview() {
        if (this.previewElement) {
            this.seesawContainer.removeChild(this.previewElement);
            this.previewElement = null;
        }
        if (this.previewLineElement) {
            this.seesawContainer.removeChild(this.previewLineElement);
            this.previewLineElement = null;
        }
    }

    updateStats() {
        const stats = this.seesaw.getStats();
        document.getElementById('leftWeight').textContent = `${stats.leftWeight.toFixed(1)} kg`;
        document.getElementById('rightWeight').textContent = `${stats.rightWeight.toFixed(1)} kg`;
        document.getElementById('nextWeight').textContent = `${this.nextWeight} kg`;
    }

    addLogEntry(text) {
        const logDiv = document.getElementById('log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = text;
        logDiv.insertBefore(entry, logDiv.firstChild);

        while (logDiv.children.length > 10) {
            logDiv.removeChild(logDiv.lastChild);
        }
    }

    updateSeesaw() {
        this.seesaw.updatePlank();
        this.seesaw.updateWeights();

        const stats = this.seesaw.getStats();
        document.getElementById('angle').textContent = `${stats.angle.toFixed(1)}°`;
        requestAnimationFrame(() => this.updateSeesaw());
    }

    animateWeights() {
        this.seesaw.animateWeights();
        requestAnimationFrame(() => this.animateWeights());
    }


    reset() {
        localStorage.clear();
        this.seesaw.reset();
        this.nextWeight = this.generateRandomWeight();
        document.getElementById('log').innerHTML = '';
        this.updateStats();
    }

    start() {
        this.loadFromState();
        this.updateStats();
        this.updateSeesaw();
        this.animateWeights();
    }

    saveState() {
        const weights = this.seesaw.weights.map(weight => ({
            mass: weight.mass,
            position: weight.position,
            distance: weight.distance,
            side: weight.side,
            color: weight.color
        }));
        const state = {
            seesawAngle: this.seesaw.currentAngle,
            leftTorque: this.seesaw.leftTorque,
            rightTorque: this.seesaw.rightTorque,
            leftWeight: this.seesaw.leftWeight,
            rightWeight: this.seesaw.rightWeight,
            nextWeight: this.nextWeight,
            weightIdCounter: Weight.idCounter
        };

        localStorage.setItem('weights', JSON.stringify(weights));
        localStorage.setItem('simState', JSON.stringify(state));
        localStorage.setItem('logs', JSON.stringify(this.getLogs()));

    }

    loadFromState() {

        const _weights = localStorage.getItem('weights');
        const _simState = localStorage.getItem('simState');
        const _logs = localStorage.getItem('logs');

        if (!_simState || !_weights || !_logs) {
            return;
        }

        try {

            const weights = JSON.parse(_weights);
            const simState = JSON.parse(_simState);
            const logs = JSON.parse(_logs);

            Weight.idCounter = simState.weightIdCounter;

            weights.forEach(weightData => {
                const weight = this.seesaw.addWeight(weightData.mass, weightData.position);
                weight.color = weightData.color;
                weight.element.style.background = weightData.color;
                weight.falling = false;
                weight.bounceVelocity = 0;
            });

            this.seesaw.currentAngle = simState.seesawAngle;
            this.seesaw.leftTorque = simState.leftTorque;
            this.seesaw.rightTorque = simState.rightTorque;
            this.seesaw.leftWeight = simState.leftWeight;
            this.seesaw.rightWeight = simState.rightWeight;

            this.nextWeight = simState.nextWeight;

            logs.forEach(logText => this.addLogEntry(logText));

        } catch (error) {
            console.error('Error loading state from localStorage:', error);
        }
    }


    getLogs() {
        const logDiv = document.getElementById('log');
        return Array.from(logDiv.children).map(entry => entry.textContent);
    }
}


