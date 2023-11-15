export class Player {
    x = null;
    y = null;
    speed = null;
    width = null;
    height = null;
    color = null;
    angle = null;
    image = null;

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.speed = 8;
        this.width = width;
        this.height = height;
        this.color = color;

        // The player will be rotating as it moves
        this.angle = 0;

        // Load player image
        this.image = document.getElementById('player');
    }

    moveDown() {
        this.y += this.speed;
    }

    moveUp() {
        this.y -= this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    draw(context) {
        context.save();

        // Move to player position
        context.translate(this.x, this.y);

        // Set shadow
        context.shadowBlur = 8;
        context.shadowColor = 'rgba(255, 255, 255, 0.5)';
        
        // Draw player image
        context.rotate(this.angle * Math.PI / 180);
        context.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
        
        // Rotate player image
        this.angle += 5;

        context.restore();
    }
}