const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const playAgainButton = document.createElement('button');
const userForm = document.getElementById('userForm');

// Set canvas size
canvas.width = 400;
canvas.height = 600;

let platforms = [];
let player;
let bottomPlatform;
let gameStarted = false;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Load high score from localStorage

// 1. User input form handling
const startGameButton = document.getElementById('startGameButton');

startGameButton.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const wallet = document.getElementById('wallet').value;

    if (username && wallet) {
        // Save username and wallet in localStorage for persistence
        localStorage.setItem('username', username);
        localStorage.setItem('wallet', wallet);

        // Hide the form and start the game
        userForm.style.display = 'none';
        startGame();
    } else {
        alert('Please enter both a username and wallet address.');
    }
});

// 2. Function to start the game after input
function startGame() {
    resizeCanvas(); // Ensure canvas fits the window size
    init();
}

// Resize canvas based on window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize game objects
function init() {
    player = new Player();

    // Create a platform at the bottom for the first bounce
    bottomPlatform = new Platform(0, canvas.height - 20, canvas.width, 20);

    platforms = generatePlatforms();
    platforms.push(bottomPlatform); // Add the bottom platform for the first bounce

    score = 0; // Reset score when the game starts
    updateScoreDisplay();
    gameLoop();
}

// Game loop
function gameLoop() {
    if (!gameStarted || gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and render platforms
    platforms.forEach((platform, index) => {
        platform.update();
        platform.draw(ctx);

        // Remove the bottom platform after the player bounces on it
        if (platform === bottomPlatform && player.y + player.height < bottomPlatform.y) {
            platforms.splice(index, 1); // Remove the bottom platform
        }
    });

    // Update and render player
    player.update(platforms);
    player.draw(ctx);

    // Check if the player falls off the screen
    if (player.y > canvas.height) {
        triggerGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Function to move the player based on X position
function movePlayer(positionX) {
    player.x = positionX - player.width / 2;

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Add touch input for horizontal movement
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const touchX = touch.clientX;
    movePlayer(touchX);
});

// Add mouse movement for testing on desktop
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    movePlayer(mouseX);
});

// Generate multiple platforms
function generatePlatforms() {
    const platforms = [];
    for (let i = 0; i < 5; i++) {
        let x = Math.random() * (canvas.width - 70);
        let y = i * 120;
        platforms.push(new Platform(x, y, 70, 10));
    }
    return platforms;
}

// Trigger game over
function triggerGameOver() {
    gameOver = true;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Save high score to localStorage
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Display Game Over message
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '48px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

    // Show Play Again button (if it was previously hidden)
    playAgainButton.textContent = 'Play Again';
    playAgainButton.style.position = 'absolute';
    playAgainButton.style.top = '60%';
    playAgainButton.style.left = '50%';
    playAgainButton.style.transform = 'translate(-50%, -50%)';
    playAgainButton.style.padding = '10px 20px';
    playAgainButton.style.fontSize = '20px';
    playAgainButton.style.display = 'block'; // Ensure the button is visible
    document.body.appendChild(playAgainButton);
}

// Restart game
function restartGame() {
    gameOver = false;
    playAgainButton.style.display = 'none'; // Hide the button while the game is running
    gameStarted = true;
    platforms = [];
    player = new Player();
    bottomPlatform = new Platform(0, canvas.height - 20, canvas.width, 20);

    platforms = generatePlatforms();
    platforms.push(bottomPlatform);

    score = 0; // Reset the score for the new game
    updateScoreDisplay();
    requestAnimationFrame(gameLoop);
}

// Update score display in HTML
function updateScoreDisplay() {
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
}

// Set up event listener for the Play Again button
playAgainButton.addEventListener('click', () => {
    restartGame();
});

// Prevent default scrolling behavior
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

