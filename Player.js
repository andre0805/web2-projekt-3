export class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.width = width;
        this.height = height;
        this.color = color;
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
        context.fillStyle = this.color;
        context.fillRect(this.width / -2, this.height / -2, this.width, this.height)
        
        context.restore();
    }
}