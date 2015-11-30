// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Sets the enemy to start off canvas to the left
    this.x = -101;
    // Randomly starts enemy moving from left to right
    // in one of the 3 "stone-block" rows
    this.y = enemyRow[Math.floor(Math.random() * enemyRow.length)];
    // Randomly sets speed of enemies
    this.speed = Math.ceil(Math.random() * 5) * 50;
    // Sets size of hit area for enemy to determine collisions
    this.width = 80;
    this.height = 80;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.move = this.speed * dt;
    if (this.x < 505) {
        this.x += this.move;
    }
    if (this.x > 505) {
        this.x = -101;
        // I realize the following lines are repeated from above
        // but, it helps create more randomness of speed and
        // enemyRow starts
        this.y = enemyRow[Math.floor(Math.random() * enemyRow.length)];
        this.speed = Math.ceil(Math.random() * 5) * 50;
    }
    // Increases speed for every 100 points scored
    if (player.score % 100 === 0) {
        this.x += this.move * (player.score / 1000);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Sets position of player at game start, after scoring
    //or after collision
    this.reset();
    // Sets size of hit area for player to determine collisions
    this.width = 80;
    this.height = 80;
    // Sets initial score of player
    this.score = 0;
    // Sets the number of available "lives" on start of game
    this.lives = 3;
    this.highScore = 0;
    this.sprite = 'images/char-boy.png';
};

// Sets player default position
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 402;
};

// Detects collisions and updates player score, highscore, number of lives left,
// and resets position. Used "MDN 2D collision detection" documentation
// to help with this. (https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
Player.prototype.update = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if (this.x < allEnemies[i].x + allEnemies[i].width && this.x + this.width > allEnemies[i].x && this.y < allEnemies[i].y + allEnemies[i].height && this.y + this.width > allEnemies[i].y) {
            // Decrements player lives on collision with enemy
            this.lives -= 1;
            this.reset();
        }
    }
    // "Resets" game. Starts player with 0 points and 3 lives
    if (this.lives === 0) {
        this.score = 0;
        this.lives = 3;
    }
    // If you "jump into the water" you get 100 points
    // For every 1000 points you get and extra life
    if (this.y < 52) {
        this.score += 100;
        if (this.score % 1000 === 0) {
            this.lives += 1;
        }
        this.reset();
    }
    // Sets player highscore
    if (this.highScore < this.score) {
        this.highScore = this.score;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(allowedKeys) {
    switch (allowedKeys) {
        case 'up':
            this.y -= 87;
            break;
        case 'right':
            this.x += 100;
            break;
        case 'down':
            this.y += 87;
            break;
        case 'left':
            this.x -= 100;
            break;
        default:
            // do nothing;
            break;
    }
    // Confines player to "stone-block", no "warping" here
    if (this.y < 313 && this.x > 404) {
        this.x = 404;
    }
    if (this.y < 313 && this.x < 0) {
        this.x = 0;
    }
    // Allows player to "warp" to other side of the board
    // while on "grass-block" area
    if (this.x > 404) {
        this.x = 0;
    }
    if (this.x < 0) {
        this.x = 404;
    }
    if (this.y > 402) {
        this.y = 402;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();

// Confines enemy to one of the 3 "stone-block" rows
var enemyRow = [60, 143, 227];

// Sets maximum number of enemies allowed on board at any given time
var enemyNum = 5;
for (var i = 0; i < enemyNum; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

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