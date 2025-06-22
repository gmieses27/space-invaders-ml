const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 20,
    speed: 8,
    color: '#0f0'
};

const bullets = [];
const enemies = [];
const enemyBullets = [];
let score = 0;

// Initialize enemies
function initEnemies() {
    enemies.length = 0;
    bullets.length = 0;
    enemyBullets.length = 0; // <-- Add this line
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
            enemies.push({
                x: col * 70 + 30,
                y: row * 50 + 30,
                width: 40,
                height: 30,
                isAlive: true,
                direction: Math.random() < 0.5 ? -1 : 1 // -1: left, 1: right
            });
        }
    }
}

// Track key states
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === ' ') shoot();
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
});

function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 3,
        y: player.y,
        width: 6,
        height: 15,
        speed: 10
    });
}

// Game loop
function update() {
    // Move player based on key states
    if (leftPressed) player.x -= player.speed;
    if (rightPressed) player.x += player.speed;

    // Player bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    // Move bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // Move enemies randomly and shoot
    enemies.forEach(enemy => {
        if (!enemy.isAlive) return;

        // Randomly change direction
        if (Math.random() < 0.02) {
            enemy.direction *= -1;
        }
        // Move enemy
        enemy.x += enemy.direction * 2;
        // Keep in bounds and bounce
        if (enemy.x < 0) {
            enemy.x = 0;
            enemy.direction = 1;
        }
        if (enemy.x > canvas.width - enemy.width) {
            enemy.x = canvas.width - enemy.width;
            enemy.direction = -1;
        }

        // Randomly shoot
        if (Math.random() < 0.01) {
            enemyBullets.push({
                x: enemy.x + enemy.width / 2 - 3,
                y: enemy.y + enemy.height,
                width: 6,
                height: 15,
                speed: 5
            });
        }
    });

    // Move enemy bullets
    enemyBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) enemyBullets.splice(index, 1);
        // Check collision with player
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            // Player hit: reset game
            alert("Game Over! Final Score: " + score);
            initEnemies();
            score = 0;
            player.x = canvas.width / 2 - 25;
            player.y = canvas.height - 60;
        }
    });

    // Check collisions
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (enemy.isAlive &&
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemy.isAlive = false;
                bullets.splice(bIndex, 1);
                score += 10;
            }
        });
    });
}

function draw() {
    // Clear screen
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    ctx.fillStyle = '#ff0';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    // Draw enemies
    ctx.fillStyle = '#f00';
    enemies.forEach(enemy => {
        if (enemy.isAlive) {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });

    // Draw enemy bullets
    ctx.fillStyle = '#0ff';
    enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
initEnemies();
gameLoop();