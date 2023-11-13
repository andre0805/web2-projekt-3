import { Game } from './models/Game.js';

var game;

window.onload = function() {
    game = new Game();
    game.start();
};

// Stop the game if the focus is lost
window.onblur = () => {
    game.resetPressedKeys();
}

// Resize the canvas if the window is resized
window.onresize = () => {
    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;
    game.player.x = game.canvas.width / 2;
    game.player.y = game.canvas.height / 2;
}

(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();