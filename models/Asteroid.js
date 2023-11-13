export class Asteroid {
    x = null;
    y = null;
    speed_x = null;
    speed_y = null;
    width = null;
    height = null;
    color = null;
    angle = null;
    rotation_speed = null;

    constructor() {
        this.width = 50;
        this.height = 50;
        this.color = 'grey';
        this.angle = 0;
        this.rotation_speed = Math.random() * 2 + 2;

        // We set the coordinates and the speed of the asteroid depending on 
        // the direction it comes from (0 = left, 1 = top, 2 = right, 3 = bottom)
        const direction = Math.floor(Math.random() * 4);

        switch (direction) {
            
            // Asteroid comes from the left side
            case 0:
                this.x = -100;
                this.y = Math.random() * (window.innerHeight);
                this.speed_x = Math.random() * 5;
                this.speed_y = (Math.random() * 3 + 3) * (this.y > window.innerHeight / 2 ? -1 : 1);
                break;
            
            // Asteroid comes from the top side
            case 1:
                this.x = Math.random() * (window.innerWidth);
                this.y = -100;
                this.speed_x = (Math.random() * 3 + 3) * (this.x > window.innerWidth / 2 ? -1 : 1);
                this.speed_y = Math.random() * 5;
                break;
            
            // Asteroid comes from the right side
            case 2:
                this.x = window.innerWidth + 100;
                this.y = Math.random() * (window.innerHeight);
                this.speed_x = -Math.random() * 5;
                this.speed_y = (Math.random() * 3 + 3) * (this.y > window.innerHeight / 2 ? -1 : 1);
                break;
            
            // Asteroid comes from the bottom side
            case 3:
                this.x = Math.random() * (window.innerWidth);
                this.y = window.innerHeight + 100;
                this.speed_x = (Math.random() * 3 + 3) * (this.x > window.innerWidth ? -1 : 1);
                this.speed_y = -Math.random() * 5;
                break;
            
        }
    }

    update() {
        this.x += this.speed_x;
        this.y += this.speed_y;
    }

    draw(context) {
        context.save();

        context.translate(this.x, this.y);
        context.shadowBlur = 8;
        context.shadowColor = 'rgba(255, 255, 255, 0.5)';

        // Draw asteroid image
        const image = document.getElementById('asteroid');
        context.rotate(this.angle * Math.PI / 180);
        context.drawImage(image, this.width / -2, this.height / -2, this.width, this.height);

        // Rotate asteroid image
        this.angle += this.rotation_speed;
        
        context.restore();
    }
}