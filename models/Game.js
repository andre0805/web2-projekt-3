import { Player } from './Player.js';
import { Asteroid } from './Asteroid.js';
import { Star } from './Star.js';
import { Explosion } from './Explosion.js';

const refreshInterval = 20;
export class Game {
    canvas = null;
    context = null;
    frameNo = null;
    interval = null;
    player = null;
    asteroids = [];
    stars = [];
    explosions = [];

    bestTime = 0;
    timeSinceLastCollision = 0;
    maxAsteroids = 10;

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
        this.canvas.width = window.innerWidth - 16;
        this.canvas.height = window.innerHeight - 16;

        // Get best time from local storage
        this.bestTime = parseInt(localStorage.getItem('bestTime')) || 0;

        // Add canvas to document
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.frameNo = 0;
        this.interval = setInterval(this.update, refreshInterval);
    }

    start = () => {
        // Init player
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, 50, 50, 'red');

        // Generate 10 asteroids on random positions outside of the canvas (100px outside)
        for (let i = 0; i < 10; i++) {
            this.asteroids.push(new Asteroid());
        }
        
        // Generate 100 stars on random positions inside the canvas
        for (let degrees = 0; degrees < 100; degrees++) {
            this.stars.push(new Star());
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
        this.frameNo++;

        this.clear();
        
        // Update player position
        this.updatePlayer();

        // Update asetroids positions
        this.updateAsteroids();
        
        // Update stars positions
        this.updateStars();

        // Update explosions
        this.updateExplosions();

        // Redraw game area
        this.draw();

        // Check for collisions between player and asteroids
        this.checkCollisions();

        // Update time since last collision
        this.timeSinceLastCollision += refreshInterval;

        // Add 1 asteroid every 5 seconds until maxAsteroids is 20
        if (this.frameNo % (5000 / refreshInterval) === 0) {
            if (this.maxAsteroids < 20) this.maxAsteroids++;
        }
    };

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
            return asteroid.x > -100 && asteroid.x < this.canvas.width + 100 && asteroid.y > -100 && asteroid.y < this.canvas.height + 100;
        });

        // Add new asteroids if there are less than maxAsteroids
        while (this.asteroids.length < this.maxAsteroids) {
            this.asteroids.push(new Asteroid());
        }
    };

    updateStars = () => {
        this.stars.forEach(star => star.update());

        // Remove stars that are out of bounds
        this.stars = this.stars.filter(star => {
            return star.x > 0 && star.x < this.canvas.width && star.y > 0 && star.y < this.canvas.height;
        });

        // Add new stars every 10 frames
        while (this.stars.length < 100) {
            this.stars.push(new Star());
        }
    }

    updateExplosions = () => {
        this.explosions.forEach(explosion => explosion.update());

        // Remove explosions that are finished
        this.explosions = this.explosions.filter(explosion => {
            return explosion.frame < 5;
        });
    }

   
    clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    draw = () => {
        // Draw stars
        this.stars.forEach(star => star.draw(this.context));
        
        // Draw player
        this.player.draw(this.context);
        
        // Draw asteroids
        this.asteroids.forEach(asteroid => asteroid.draw(this.context));

        // Draw explosions
        this.explosions.forEach(explosion => explosion.draw(this.context));

        
        
        const bestTime = new Date(this.bestTime);
        const bestTimeMinutes = bestTime.getMinutes() < 10 ? `0${bestTime.getMinutes()}` : bestTime.getMinutes();
        const bestTimeSeconds = bestTime.getSeconds() < 10 ? `0${bestTime.getSeconds()}` : bestTime.getSeconds();
        let bestTimeMilliseconds = bestTime.getMilliseconds() < 100 ? `0${bestTime.getMilliseconds()}` : bestTime.getMilliseconds();
        bestTimeMilliseconds = bestTimeMilliseconds < 10 ? `0${bestTimeMilliseconds}` : bestTimeMilliseconds;
        
        const bestTimeText = `Best time: ${bestTimeMinutes}:${bestTimeSeconds}:${bestTimeMilliseconds}`;
        const bestTimeTextWidth = this.context.measureText(bestTimeText).width;
        const bestTimeTextHeight = this.context.measureText(bestTimeText).actualBoundingBoxAscent;
        
        
        const timeSinceLastCollision = new Date(this.timeSinceLastCollision);
        const timeSinceLastCollisionMinutes = timeSinceLastCollision.getMinutes() < 10 ? `0${timeSinceLastCollision.getMinutes()}` : timeSinceLastCollision.getMinutes();
        const timeSinceLastCollisioneSeconds = timeSinceLastCollision.getSeconds() < 10 ? `0${timeSinceLastCollision.getSeconds()}` : timeSinceLastCollision.getSeconds();
        let timeSinceLastCollisionMilliseconds = timeSinceLastCollision.getMilliseconds() < 100 ? `0${timeSinceLastCollision.getMilliseconds()}` : timeSinceLastCollision.getMilliseconds();
        timeSinceLastCollisionMilliseconds = timeSinceLastCollisionMilliseconds < 10 ? `0${timeSinceLastCollisionMilliseconds}` : timeSinceLastCollisionMilliseconds;
        
        const timeSinceLastCollisionText = `Time: ${timeSinceLastCollisionMinutes}:${timeSinceLastCollisioneSeconds}:${timeSinceLastCollisionMilliseconds}`;
        const timeSinceLastCollisionTextWidth = this.context.measureText(timeSinceLastCollisionText).width;
        const timeSinceLastCollisionTextHeight = this.context.measureText(timeSinceLastCollisionText).actualBoundingBoxAscent;
    
        // Draw text background
        this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.context.fillRect(
            this.canvas.width - Math.max(bestTimeTextWidth, timeSinceLastCollisionTextWidth) - 16 * 2,
            0,
            Math.max(bestTimeTextWidth, timeSinceLastCollisionTextWidth) + 16 * 2,
            bestTimeTextHeight + timeSinceLastCollisionTextHeight + 16 * 3
        );
        
        // Draw best time and time since last collision
        this.context.font = '30px Arial';
        this.context.fillStyle = 'white';
        this.context.fillText(bestTimeText, this.canvas.width - bestTimeTextWidth - 16, bestTimeTextHeight + 16);
        this.context.fillText(timeSinceLastCollisionText, this.canvas.width - timeSinceLastCollisionTextWidth - 16, bestTimeTextHeight + timeSinceLastCollisionTextHeight + 16 * 2);

    };


    checkCollisions = () => {
        this.asteroids.forEach(asteroid => {
            if (this.checkCollision(this.player, asteroid)) {
                this.asteroids = this.asteroids.filter(a => a !== asteroid);
                
                // Play explosion sound
                const explosionAudio = document.getElementById('explosion_audio');
                explosionAudio.play()
                    .then(() => {
                        explosionAudio.currentTime = 0;
                    })
                    .catch (error => {
                        console.error(error);
                    });

                // Add explosion
                const explosionCenterX = (this.player.x + asteroid.x) / 2;
                const explosionCenterY = (this.player.y + asteroid.y) / 2;
                this.explosions.push(new Explosion(explosionCenterX, explosionCenterY));

                // Update best time
                if (this.timeSinceLastCollision > this.bestTime) {
                    this.bestTime = this.timeSinceLastCollision;
                    
                    // Save best time to local storage
                    localStorage.setItem('bestTime', this.bestTime);
                }

                // Update time since last collision
                this.timeSinceLastCollision = 0;
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
