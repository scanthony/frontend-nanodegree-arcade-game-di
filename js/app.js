"use strict";

// Global config parameters

var config;
var player;
var allEnemies = [];

var starterWords = ["Once upon a time,", "There was a world of Beattles..."]

// Enemies our player must avoid
var Enemy = function() {
    //Initializing the Object
    this.initialize();
    
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    
};

Enemy.prototype.initialize = function(){
    // The direction the enemy moves
    this.moveDirection = ['toLeft', 'toRight'][Math.floor(Math.random() * 2)];
    
    // The speed the enemy moves
    this.speedRate = config.baselineSpeed + Math.random() * config.deltaSpeed; 
    
    // Initial position
    if (this.moveDirection == 'toRight' ) {
        this.x = -100;
    } else {
        this.x = 600;
    }
    this.y = 80 * Math.ceil(Math.random() * 3) - 20;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    // Restart enemy object, if it has moved out of the canvas
    if (this.x > 580 && this.moveDirection == 'toRight') {
        this.initialize();
    }
    if (this.x < -80 && this.moveDirection == 'toLeft') {
        this.initialize();
    }
    
    // Player will loose one life and get restarted, if crashed with the enemy
    
    if (this.isCrashed(player)) {
        player.initialize();
        player.lives--;
        
        // if game over, freeze the enemies
        if (player.isGameOver()) {
            allEnemies.forEach(function(curEnemy) {
                curEnemy.speedRate = 20;
            });
        }
    }
    
    // Move the enemy
    
    if (this.moveDirection == 'toRight') {
        this.x += this.speedRate * dt;
    } else {
        this.x -= this.speedRate * dt;
    }
};

Enemy.prototype.isCrashed = function(player) {
    var deltaCrash = 25;
    return Math.abs(player.x - this.x) < deltaCrash && Math.abs(player.y - this.y) < deltaCrash;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (this.moveDirection == "toRight") {
        ctx.drawImage(Resources.get(this.sprite), 1, 75, 100, 75, this.x, this.y+80, 100, 75);
    } else {
        // ctx.save();
        // ctx.scale(-1,1);
        // ctx.rotate(180 * Math.PI / 180);
        ctx.drawImage(Resources.get(this.sprite), 1, 1, 100, 75, this.x, this.y+80, 100, 75);
        // ctx.restore();
    }
    
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.initialize();
    
    // Total lives
    this.lives = config.maxLives; 
    // Player image
    this.sprite = 'images/char-boy.png';
};

Player.prototype.initialize = function() {
    // Random X position
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = 383;
    this.splashWordsSta = false;
};

Player.prototype.update = function() {
    // Restart if succeed
    if (this.isSuccess()) {
        config.deltaSpeed += 60;
        this.lives++;
        this.initialize();
    }
};

Player.prototype.isSuccess = function() {
    return this.y < 0;
};

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    
    if (this.splashWordsSta) {
        ctx.font = '50pt Impact';
        ctx.fillStyle = 'white';
        ctx.fillText('Game Starts', 80, 380); 
    } else {
        if (this.lives > 0) {
            ctx.font = '20pt Impact';
            ctx.fillStyle = 'black';
            ctx.fillText('Lives: ' + this.lives, 40, 580); 
        } else {
            ctx.font = '50pt Impact';
            ctx.fillStyle = 'white';
            ctx.fillText('Game Over', 80, 380); 
        }
    }   
};

Player.prototype.isGameOver = function() {
    return this.lives <= 0;
    // || config.deltaSpeed > 80;
};

Player.prototype.handleInput = function(keyCode) {
    if (this.splashWordsSta) {
        return;
    }
    if (this.isGameOver()) {
        startGame();
    }
    if (keyCode === 'left') {
        this.moveLeft()
    } else if (keyCode === 'right') {
        this.moveRight();
    } else if (keyCode === 'up') {
        this.moveUp();
    } else if (keyCode === 'down') {
        this.moveDown();
    }
};

Player.prototype.moveLeft = function() {
    if (this.x > 0) {
        this.x = this.x - 101;
    }
};

// The following methods move the player in all four directions
Player.prototype.moveRight = function() {
    if (this.x < 404) {
        this.x = this.x + 101;
    }
};


Player.prototype.moveUp = function() {
    if (this.y > 0) {
        this.y = this.y - 82;
    }
};


Player.prototype.moveDown = function() {
    if (this.y < 460) {
        this.y = this.y + 82;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var startGame = function() {
    
    config = {
    baselineSpeed: 250,
    deltaSpeed: 20,
    maxLives: 3, 
    enemyNumber: 4
    };
    
    player = new Player();
    player.splashWordsSta = true;
    //Unlock keyboard and delete splash
    setTimeout(function() {player.splashWordsSta = false;}, 1800);
    allEnemies = [];
    for (var i = 0; i < config.enemyNumber; i++) {
        var enemy = new Enemy();
        allEnemies.push(enemy);
    }
    
};


startGame();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
