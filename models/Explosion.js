export class Explosion {
    x = null;
    y = null;
    image = null;
    width = null;
    height = null;
    frame = null;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.image = 'explosion0';
        this.width = 75;
        this.height = 75;
        this.frame = 0;
    }

    update() {
        this.frame++;
        this.image = `explosion${this.frame}`;
    }

    draw(context) {
        context.save();

        context.translate(this.x, this.y);

        // Draw explosion image
        const image = document.getElementById(this.image);
        context.drawImage(image, this.width / -2, this.height / -2, this.width, this.height);

        context.restore();
    }
}