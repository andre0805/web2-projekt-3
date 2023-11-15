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
    image = null;

    constructor(canvas, maxSpeedFactor) {
        this.width = 50;
        this.height = 50;
        this.color = 'grey';

        // The asteroid will be rotating as it moves
        this.angle = 0;
        this.rotation_speed = Math.random() * 2 + 2;

        // Load asteroid image
        this.image = document.getElementById('asteroid');

        // Set some initial random speed (maxSpeedFactor is used to make the game harder as the player progresses)
        this.speed_x = Math.floor(Math.random() * 5) * maxSpeedFactor;
        this.speed_y = Math.floor(Math.random() * 5) * maxSpeedFactor;
        
        // We set the coordinates and the speed of the asteroid depending on 
        // the direction it comes from (0 = left, 1 = top, 2 = right, 3 = bottom)
        const direction = Math.floor(Math.random() * 4);

        switch (direction) {

            // Asteroid comes from the left side
            case 0:
                this.x = -100;
                this.y = Math.random() * canvas.height;
                
                // If asteroid starts from the upper half of the screen, make it go down, otherwise make it go up
                this.speed_y = this.y < canvas.height / 2 ? this.speed_y : -this.speed_y;
                
                break;
            
            // Asteroid comes from the top side
            case 1:
                this.x = Math.random() * canvas.width;
                this.y = -100;
                
                // If asteroid starts from the left half of the screen, make it go right, otherwise make it go left
                this.speed_x = this.x < canvas.width / 2 ? this.speed_x : -this.speed_x;
                
                break;
            
            // Asteroid comes from the right side
            case 2:
                this.x = canvas.width + 100;
                this.y = Math.random() * canvas.height;
                
                // When asteroid comes from the right side we need to set negative speed_x so that it goes left
                this.speed_x *= -1;
                
                // If asteroid starts from the upper half of the screen, make it go down, otherwise make it go up
                this.speed_y = this.y < canvas.height / 2 ? this.speed_y : -this.speed_y;
                
                break;
            
            // Asteroid comes from the bottom side
            case 3:
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 100;

                // If asteroid starts from the left half of the screen, make it go right, otherwise make it go left
                this.speed_x = this.x < canvas.width / 2 ? this.speed_x : -this.speed_x;

                // When asteroid comes from the bottom side we need to set negative speed_y so that it goes up
                this.speed_y *= -1;

                break;
        }
    }

    update() {
        this.x += this.speed_x;
        this.y += this.speed_y;
    }

    draw(context) {
        context.save();

        // Move to asteroid position
        context.translate(this.x, this.y);

        // Set shadow
        context.shadowBlur = 8;
        context.shadowColor = 'rgba(255, 255, 255, 0.5)';

        // Draw asteroid image
        context.rotate(this.angle * Math.PI / 180);
        context.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);

        // Rotate asteroid image
        this.angle += this.rotation_speed;
        
        context.restore();
    }
}