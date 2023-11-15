export class Star {
    x = null;
    y = null;
    speed_x = null;
    speed_y = null;
    size = null;
    color = null;

    constructor() {
        // The star will be moving from the center of the screen to the outside depending on 
        // the angle it has (in angle) and the radius of the circle it is moving on
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * window.innerWidth / 2;
        
        // We calculate the coordinates of the star from the center based on the angle and the radius
        this.x = window.innerWidth / 2 + Math.cos(angle) * radius;
        this.y = window.innerHeight / 2 + Math.sin(angle) * radius;
        
        // Speed is calculated based on the radius so that stars that are further away move slower (we divide by 50 to make it slower)
        this.speed_x = Math.cos(angle) * radius / 50;
        this.speed_y = Math.sin(angle) * radius / 50;
        
        // Stars have random size so that they look more natural
        this.size = Math.random() * 5;

        // Random gray color
        const gray = Math.floor(Math.random() * (256 - 128) + 127);
        this.color = `rgb(${gray}, ${gray}, ${gray})`;
    }

    update() {
        this.x += this.speed_x;
        this.y += this.speed_y;

        // Make stars move faster and faster as they move away from the center
        this.speed_x *= 1.01;
        this.speed_y *= 1.01;
    }

    draw(context) {
        context.save();

        // Move to star position
        context.translate(this.x, this.y);

        // Draw star
        context.fillStyle = this.color;
        context.fillRect(-this.size / 2, this.size / 2, this.size, this.size);

        context.restore();
    }
}