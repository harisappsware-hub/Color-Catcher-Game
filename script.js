const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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

// Handle paddle movement
let leftPressed = false;
let rightPressed = false;

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

// Update game objects
function update() {
    // Move paddle
    if (leftPressed && paddle.x > 0) paddle.x -= paddle.speed;
    if (rightPressed && paddle.x + paddle.width < canvas.width) paddle.x += paddle.speed;

    // Move circles
    for (let i = 0; i < circles.length; i++) {
        let c = circles[i];
        c.y += c.speed;

        // Check collision with paddle
        if (c.y + c.radius >= paddle.y &&
            c.x > paddle.x && c.x < paddle.x + paddle.width) {
            score++;
            document.getElementById('score').textContent = score;
            circles.splice(i, 1);
            i--;
        }

        // Check if circle missed
        else if (c.y - c.radius > canvas.height) {
            lives--;
            document.getElementById('lives').textContent = lives;
            circles.splice(i, 1);
            i--;
            if (lives <= 0) {
                alert(`Game Over! Your score: ${score}`);
                document.location.reload();
            }
        }
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddle
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Draw circles
    for (let c of circles) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2);
        ctx.fillStyle = c.color;
        ctx.fill();
        ctx.closePath();
    }
}

// Game loop
function gameLoop() {
    if (Math.random() < 0.03) createCircle(); // spawn new circle randomly
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
