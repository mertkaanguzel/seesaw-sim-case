export class Weight {
    static idCounter = 0;
    static ContainerWidth = 800;
    static ContainerHeight = 500;
    static Colors = [
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
        this.color = Weight.Colors[Math.floor(Math.random() * Weight.Colors.length)];
        this.container = container;

        this.y = -100;
        this.falling = true;
        this.bounceVelocity = 0;

        const angleRad = (currentAngle * Math.PI) / 180;
        const centerX = Weight.ContainerWidth / 2;
        const centerY = Weight.ContainerHeight / 2;
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

    updatePosition(currentAngle) {
        const angleRad = (currentAngle * Math.PI) / 180;
        const centerX = Weight.ContainerWidth / 2;
        const centerY = Weight.ContainerHeight / 2;

        const relX = this.position;
        const relY = 0;

        const rotatedX = relX * Math.cos(angleRad) - relY * Math.sin(angleRad);
        const rotatedY = relX * Math.sin(angleRad) + relY * Math.cos(angleRad);

        const bounceX = this.bounceVelocity * Math.sin(angleRad);
        const bounceY = -this.bounceVelocity * Math.cos(angleRad);

        this.element.style.left = `${centerX + rotatedX - this.size + bounceX}px`;
        this.element.style.top = `${centerY + rotatedY - this.size + bounceY}px`;
    }

    animate(currentAngle) {
        if (this.falling) {
            this.y += 8;
            if (this.y >= this.targetY) {
                this.y = this.targetY;
                this.falling = false;
                this.bounceVelocity = -3;
                this.updatePosition(currentAngle);
            } else {
                this.element.style.left = `${this.startX}px`;
                this.element.style.top = `${this.y}px`;
            }
        } else if (Math.abs(this.bounceVelocity) > 0.1) {
            this.bounceVelocity += 0.5;
            if (this.bounceVelocity > 0) {
                this.bounceVelocity = 0;
            }
            this.updatePosition(currentAngle);
        } else {
            this.updatePosition(currentAngle);
        }
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