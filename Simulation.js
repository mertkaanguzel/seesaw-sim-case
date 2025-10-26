import { Seesaw } from './Seesaw.js';

export class Simulation {
    static instance = null;
    static PLANK_LENGTH = 400;
    static CONTAINER_WIDTH = 800;
    static CONTAINER_HEIGHT = 500;

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

    static run() {
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

        });

        this.seesawClickable.addEventListener('mousemove', (e) => {

        });

        this.seesawClickable.addEventListener('mouseleave', () => {
 
        });

        this.resetBtn.addEventListener('click', () => {
            this.reset();
        });
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

    reset() {
        this.seesaw.reset();
        this.nextWeight = this.generateRandomWeight();
        document.getElementById('log').innerHTML = '';
        this.updateStats();
    }

    start() {
        this.updateStats();
        this.updateSeesaw();
        this.animateWeights();
    }
}


