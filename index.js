import { Game } from './Game.js';

var game;

window.onload = function() {
    game = new Game();
    game.start();
};

// Stop the game if the focus is lost
window.onblur = () => {
    game.resetPressedKeys();
}

(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();