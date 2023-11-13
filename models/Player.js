export class Player {
    x = null;
    y = null;
    speed = null;
    width = null;
    height = null;
    angle = null;
    color = null;
    image = null;

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.speed = 8;
        this.width = width;
        this.height = height;
        this.angle = 0;
        this.color = color;
        this.image = 'player';
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

        context.translate(this.x, this.y);

        // Draw player image
        const image = document.getElementById(this.image);
        context.rotate(this.angle * Math.PI / 180);
        context.drawImage(image, this.width / -2, this.height / -2, this.width, this.height);
        
        // Rotate player image
        this.angle += 5;

        context.restore();
    }
}