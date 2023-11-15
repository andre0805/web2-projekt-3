import { Player } from './Player.js';
import { Asteroid } from './Asteroid.js';
import { Star } from './Star.js';
import { Explosion } from './Explosion.js';

// Refresh interval in milliseconds (60fps)
const refreshInterval = 1000 / 60;
export class Game {
    canvas = null;
    context = null;
    frameNo = null;
    interval = null;
    player = null;
    asteroids = [];
    stars = [];
    explosions = [];

    // Variables for tracking time
    bestTime = 0;
    timeSinceLastCollision = 0;

    // Variables for tracking game difficulty
    maxAsteroids = 15;
    maxAsteroidSpeedFactor = 1;

    // Variables for tracking pressed keys (arrow keys for moving the player)
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
        
        // Set canvas size to window size (with 16px margin)
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

        // Generate asteroids on random positions outside of the canvas (100px outside)
        for (let i = 0; i < this.maxAsteroids; i++) {
            this.asteroids.push(new Asteroid(this.canvas, this.maxAsteroidSpeedFactor));
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

        // Remove event listener for arrow keys
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);

        // Remove canvas elements
        this.player = null;
        this.asteroids = [];
        this.stars = [];
        this.explosions = [];

        // Reset time variables
        this.bestTime = 0;
        this.timeSinceLastCollision = 0;

        // Reset max asteroids and max asteroid speed factor
        this.maxAsteroids = 15;
        this.maxAsteroidSpeedFactor = 1;

        // Reset pressed keys so that player doesn't move when game is stopped
        this.resetPressedKeys();
    }

    pause = () => {
        clearInterval(this.interval);

        // Reset pressed keys so that player doesn't move when game is stopped
        this.resetPressedKeys();
    };

    resume = () => {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(this.update, refreshInterval);

        // Add event listener for arrow keys
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

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

        // Add 1 asteroid every 5 seconds until maxAsteroids is 40, then add 0.1 to maxAsteroidSpeedFactor every 5 seconds until it is 3
        if (this.frameNo % (5000 / refreshInterval) === 0) {
            if (this.maxAsteroids < 40) this.maxAsteroids++;
            if (this.maxAsteroidSpeedFactor < 3) this.maxAsteroidSpeedFactor += 0.1;
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
        this.asteroids = this.asteroids.filter(asteroid => asteroid.x > -100 && asteroid.x < this.canvas.width + 100 && asteroid.y > -100 && asteroid.y < this.canvas.height + 100);

        // Add new asteroids if there are less than maxAsteroids
        while (this.asteroids.length < this.maxAsteroids) {
            this.asteroids.push(new Asteroid(this.canvas, this.maxAsteroidSpeedFactor));
        }
    };

    updateStars = () => {
        this.stars.forEach(star => star.update());

        // Remove stars that are out of bounds
        this.stars = this.stars.filter(star => star.x > 0 && star.x < this.canvas.width && star.y > 0 && star.y < this.canvas.height);

        // Add new stars if there are less than 100
        while (this.stars.length < 100) {
            this.stars.push(new Star());
        }
    }

    updateExplosions = () => {
        this.explosions.forEach(explosion => explosion.update());

        // Remove explosions that are finished
        this.explosions = this.explosions.filter(explosion => explosion.frame < 5);
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

        // Draw best time and time since last collision text
        this.drawTimeText();

        // Draw pause/resume text
        this.drawPauseResumeText();
    };

    drawTimeText = () => {
        this.context.save();

        // Text style for best time and time since last collision (we define it here so that measureText function works properly)
        this.context.font = '24px Courier';
        this.context.textAlign = 'right';
        
        // Calculate time components for best time
        const bestTime = new Date(this.bestTime);
        const bestTimeMinutes = bestTime.getMinutes() < 10 ? `0${bestTime.getMinutes()}` : bestTime.getMinutes();
        const bestTimeSeconds = bestTime.getSeconds() < 10 ? `0${bestTime.getSeconds()}` : bestTime.getSeconds();
        let bestTimeMilliseconds = bestTime.getMilliseconds() < 100 ? `0${bestTime.getMilliseconds()}` : bestTime.getMilliseconds();
        bestTimeMilliseconds = bestTimeMilliseconds < 10 ? `0${bestTimeMilliseconds}` : bestTimeMilliseconds;
        
        const bestTimeText = this.bestTime == 0 ? 'Best time: --:--:---' : `Best time: ${bestTimeMinutes}:${bestTimeSeconds}:${bestTimeMilliseconds}`;
        const bestTimeTextWidth = this.context.measureText(bestTimeText).width;
        const bestTimeTextHeight = this.context.measureText(bestTimeText).actualBoundingBoxAscent;
        
        // Calculate time components for time since last collision
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
        
        this.context.fillStyle = 'white';
        
        // Draw best time text
        this.context.fillText(
            bestTimeText,
            this.canvas.width - 16,
            bestTimeTextHeight + 16
        );
        
        // If time since last collision is greater than best time, make it blink green every 0.5 seconds (30 frames for green, 30 frames for white color)
        const isNewBestTime = this.bestTime != 0 && this.timeSinceLastCollision > this.bestTime;
        const shouldBlink = isNewBestTime && this.frameNo % 60 < 30;
        this.context.fillStyle = shouldBlink ? 'rgba(40, 255, 40, 1)' : 'white';
        
        // Draw time since last collision text
        this.context.fillText(
            timeSinceLastCollisionText,
            this.canvas.width - 16,
            bestTimeTextHeight + timeSinceLastCollisionTextHeight + 16 * 2
        );

        this.context.restore();
    };

    drawPauseResumeText = () => {
        this.context.save();

        // Text style for pause/resume text (we define it here so that measureText function works properly)
        this.context.font = '18px Courier New';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        const text = 'Press P to pause. Press R to resume.';
        const textWidth = this.context.measureText(text).width;
        const textHeight = this.context.measureText(text).actualBoundingBoxAscent;

        // Draw pause/resume text background
        this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.context.fillRect(
            0,
            this.canvas.height - textHeight - 16 * 2,
            this.canvas.width,
            textHeight + 16 * 2
        );

        // Draw pause/resume text
        this.context.fillStyle = 'white';
        this.context.fillText(
            text,
            this.canvas.width / 2,
            this.canvas.height - textHeight / 2 - 16
        );

        this.context.restore();
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

                // Add explosion with center in the middle of the player and the asteroid
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

                // Reset max asteroids and max asteroid speed factor
                this.maxAsteroids = 10;
                this.maxAsteroidSpeedFactor = 1;
            }
        });
    };

    checkCollision = (obj1, obj2) => {
        // Objects are colieded if obj1 center is inside obj2 bounds

        // Calculate centers of objects
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
                this.resume();
                this.pressedKeys.arrowUp = true;
                break;
            case "ArrowDown":
                this.resume();
                this.pressedKeys.arrowDown = true;
                break;
            case "ArrowLeft":
                this.resume();
                this.pressedKeys.arrowLeft = true;
                break;
            case "ArrowRight":
                this.resume();
                this.pressedKeys.arrowRight = true;
                break;
            case "p":
                this.pause();
                break;
            case "r":
                this.resume();
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
