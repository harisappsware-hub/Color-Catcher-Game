const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const modal = document.getElementById('gameOverModal');
const finalScoreEl = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgain');

let paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 20,
    speed: 7
};

let circles = [];
let score = 0;
let lives = 3;

let leftPressed = false;
let rightPressed = false;

// Paddle movement
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
});

// Create random circle
function createCircle() {
    let radius = Math.random() * 20 + 10;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = -radius;
    let color = `hsl(${Math.random()*360}, 70%, 60%)`;
    let speed = Math.random() * 2 + 2;
    circles.push({x, y, radius, color, speed});
}

// Update objects
function update() {
    if (leftPressed && paddle.x > 0) paddle.x -= paddle.speed;
    if (rightPressed && paddle.x + paddle.width < canvas.width) paddle.x += paddle.speed;

    for (let i = 0; i < circles.length; i++) {
        let c = circles[i];
        c.y += c.speed;

        // Collision with paddle
        if (c.y + c.radius >= paddle.y &&
            c.x > paddle.x && c.x < paddle.x + paddle.width) {
            score++;
            scoreEl.textContent = score;
            circles.splice(i, 1);
            i--;
        } 
        // Missed circle
        else if (c.y - c.radius > canvas.height) {
            lives--;
            livesEl.textContent = lives;
            circles.splice(i, 1);
            i--;
            if (lives <= 0) {
                showGameOver();
            }
        }
    }
}

// Draw game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Paddle
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Circles
    for (let c of circles) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2);
        ctx.fillStyle = c.color;
        ctx.fill();
        ctx.closePath();
    }
}

// Game loop
let gameRunning = true;
function gameLoop() {
    if (!gameRunning) return;

    if (Math.random() < 0.03) createCircle();
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Show game over modal
function showGameOver() {
    gameRunning = false;
    finalScoreEl.textContent = score;
    modal.style.display = 'flex';
}

// Play again
playAgainBtn.addEventListener('click', () => {
    score = 0;
    lives = 3;
    circles = [];
    scoreEl.textContent = score;
    livesEl.textContent = lives;
    modal.style.display = 'none';
    gameRunning = true;
    gameLoop();
});

// Start game
gameLoop();
