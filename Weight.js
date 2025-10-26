export class Weight {
    static idCounter = 0;
    static CONTAINER_WIDTH = 800;
    static CONTAINER_HEIGHT = 500;
    static COLORS = [
        '#3498db',
        '#2ecc71',
        '#e74c3c',
        '#f39c12',
        '#9b59b6',
        '#1abc9c',
        '#e67e22',
        '#34495e',
    ];

    constructor(mass, positionX, container, currentAngle) {
        this.id = Weight.idCounter++;
        this.mass = mass;
        this.position = positionX;
        this.distance = Math.abs(positionX);
        this.side = positionX < 0 ? 'left' : 'right';
        this.size = 15 + mass * 2;
        this.color = Weight.COLORS[Math.floor(Math.random() * Weight.COLORS.length)];
        this.container = container;


        const angleRad = (currentAngle * Math.PI) / 180;
        const centerX = Weight.CONTAINER_WIDTH / 2;
        const centerY = Weight.CONTAINER_HEIGHT / 2;
        this.startX = centerX + positionX - this.size;
        const rotatedY = positionX * Math.sin(angleRad);
        this.targetY = centerY + rotatedY - this.size;

        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'object';
        this.element.id = `object-${this.id}`;
        this.element.style.width = `${this.size * 2}px`;
        this.element.style.height = `${this.size * 2}px`;
        this.element.style.background = this.color;
        this.element.style.left = `${this.startX}px`;
        this.element.style.top = '-100px';
        this.element.textContent = `${this.mass}kg`;
        this.container.appendChild(this.element);
    }

    getTorque() {
        return this.mass * this.distance;
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.container.removeChild(this.element);
        }
    }
}