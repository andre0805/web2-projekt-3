import { Game } from './models/Game.js';

var game;

// Start the game when the window is loaded
window.onload = function() {
    game = new Game();
    game.start();
};

// Pause the game when the focus is lost
window.onblur = () => {
    game.pause();
}

// Resume the game when the focus is gained
window.onfocus = () => {
    game.resume();
}

// Resume the game when window is clicked or key is pressed
window.onclick = () => {
    game.resume();
}

// Resize the canvas if the window is resized
window.onresize = () => {
    game.canvas.width = window.innerWidth - 20;
    game.canvas.height = window.innerHeight - 20;
    
    // Reset the player position
    game.player.x = game.canvas.width / 2;
    game.player.y = game.canvas.height / 2;

    // Reset stars
    game.stars = [];
}
