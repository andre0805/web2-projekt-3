import { Player } from './Player.js';
import { Asteroid } from './Asteroid.js';

export class Game {
    canvas = null;
    context = null;
    frameNo = null;
    interval = null;
    player = null;
    asteroids = [];

    pressedKeys = { 
        arrowUp: false, 
        arrowDown: false, 
        arrowLeft: false, 
        arrowRight: false 
    };

    constructor() {
        // Define canvas and context
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        
        // Set canvas size to window size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Add canvas to document
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.frameNo = 0;
        this.interval = setInterval(this.update, 20);
    }

    start = () => {
        // Init player
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, 100, 100, 'red');

        // Generate 10 asteroids on random positions outside of the canvas (100px outside)
        for (let i = 0; i < 10; i++) {
            this.asteroids.push(new Asteroid());
        }

        // Add event listener for arrow keys
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    };

    stop = () => {
        clearInterval(this.interval);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        this.resetPressedKeys();
    };

    update = () => {
        this.clear();
        
        // Update player position
        this.updatePlayer();

        // Update asetroids positions
        this.updateAsteroids();
        
        // Redraw game area
        this.draw();

        // TODO: Check for collisions between player and asteroids
        this.checkCollisions();

        // TODO: Check for win/loss condition
    };
    
    clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    updatePlayer = () => {
        // Apply movement if arrow key is pressed
        if (this.pressedKeys.arrowUp) this.player.moveUp();
        if (this.pressedKeys.arrowDown) this.player.moveDown();
        if (this.pressedKeys.arrowLeft) this.player.moveLeft();
        if (this.pressedKeys.arrowRight) this.player.moveRight();

        // If player is out of bounds, move it to the other side
        if (this.player.x > this.canvas.width) this.player.x = 0;
        if (this.player.x < 0) this.player.x = this.canvas.width;
        if (this.player.y > this.canvas.height) this.player.y = 0;
        if (this.player.y < 0) this.player.y = this.canvas.height;
    };

    updateAsteroids = () => {
        this.asteroids.forEach(asteroid => asteroid.update());

        // Remove asteroids that are out of bounds
        this.asteroids = this.asteroids.filter(asteroid => {
            if (asteroid.x < -100 || asteroid.x > this.canvas.width + 100 || asteroid.y < -100 || asteroid.y > this.canvas.height + 100) {
                return false;
            } else {
                return true;
            }
        });

        // Add new asteroids if there are less than 10
        while (this.asteroids.length < 10) {
            this.asteroids.push(new Asteroid());
        }
    };

    draw = () => {
        // Draw player
        this.player.draw(this.context);
        
        // Draw asteroids
        this.asteroids.forEach(asteroid => asteroid.draw(this.context));
    };

    checkCollisions = () => {
        this.asteroids.forEach(asteroid => {
            if (this.checkCollision(this.player, asteroid)) {
                this.asteroids = this.asteroids.filter(a => a !== asteroid);
                // TODO: Play sound
                // TODO: Show explosion animation
            }
        });
    };

    checkCollision = (obj1, obj2) => {
        // Objects are colieded if obj1 center is inside obj2 bounds

        const obj1CenterX = obj1.x + obj1.width / 2;
        const obj1CenterY = obj1.y + obj1.height / 2;
        const obj2CenterX = obj2.x + obj2.width / 2;
        const obj2CenterY = obj2.y + obj2.height / 2;

        // Check if obj1 center is inside obj2 bounds
        if (Math.abs(obj1CenterX - obj2CenterX) > obj1.width / 2 + obj2.width / 2) return false;
        if (Math.abs(obj1CenterY - obj2CenterY) > obj1.height / 2 + obj2.height / 2) return false;

        return true
    };


    resetPressedKeys = () => {
        this.pressedKeys = { 
            arrowUp: false, 
            arrowDown: false, 
            arrowLeft: false, 
            arrowRight: false 
        };
    }
        
    // Function to handle arrow key press events
    handleKeyDown = (event) => {
        switch (event.key) {
            case "ArrowUp":
                this.pressedKeys.arrowUp = true;
                break;
            case "ArrowDown":
                this.pressedKeys.arrowDown = true;
                break;
            case "ArrowLeft":
                this.pressedKeys.arrowLeft = true;
                break;
            case "ArrowRight":
                this.pressedKeys.arrowRight = true;
                break;
            default:
                // Ignore other keys
                break;
        }
    }

    // Function to handle arrow key release events
    handleKeyUp = (event) => {
        switch (event.key) {
            case "ArrowUp":
                this.pressedKeys.arrowUp = false;
                break;
            case "ArrowDown":
                this.pressedKeys.arrowDown = false;
                break;
            case "ArrowLeft":
                this.pressedKeys.arrowLeft = false;
                break;
            case "ArrowRight":
                this.pressedKeys.arrowRight = false;
                break;
            default:
                // Ignore other keys
                break;
        }
    }
}