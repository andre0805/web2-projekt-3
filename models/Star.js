export class Star {
    x = null;
    y = null;
    speed_x = null;
    speed_y = null;
    size = null;
    color = null;

    constructor() {
        // The star will be moving from the center of the screen to the outside depending on 
        // the angle it has (in radians) and the radius of the circle it is moving on
        const degrees = Math.random() * 360;
        const radians = degrees * Math.PI / 180;
        const radius = Math.random() * window.innerWidth / 2;
        
        this.x = window.innerWidth / 2 + Math.cos(radians) * radius;
        this.y = window.innerHeight / 2 + Math.sin(radians) * radius;
        this.speed_x = Math.cos(radians) * radius / 50;
        this.speed_y = Math.sin(radians) * radius / 50;
        
        this.size = Math.random() * 5;

        // Random gray color
        const gray = Math.floor(Math.random() * (256 - 128) + 127);
        this.color = `rgb(${gray}, ${gray}, ${gray})`;
    }

    update() {
        this.x += this.speed_x;
        this.y += this.speed_y;
        this.speed_x *= 1.01;
        this.speed_y *= 1.01;
    }

    draw(context) {
        context.save();

        context.translate(this.x, this.y);
        context.fillStyle = this.color;
        context.fillRect(-this.size / 2, this.size / 2, this.size, this.size);

        context.restore();
    }
}