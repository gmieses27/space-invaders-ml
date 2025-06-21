import { getAIMove } from './api.js'; // At the top of your file

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let gameState = 'MENU'; // <-- Add this here

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 20,
  speed: 8,
  isMovingLeft: false,
  isMovingRight: false
};

const bullets = [];
const enemies = [];
const enemyBullets = [];
let score = 0;

// Initialize enemies
function initEnemies() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      enemies.push({
        x: col * 70 + 30,
        y: row * 50 + 30,
        width: 40,
        height: 30,
        isAlive: true
      });
    }
  }
}

// Input handling
document.addEventListener("keydown", (e) => {
  if (gameState === 'MENU' && e.key === " ") {
    gameState = 'PLAYING';
  }
  if (e.key === "ArrowLeft") player.isMovingLeft = true;
  if (e.key === "ArrowRight") player.isMovingRight = true;
  if (e.key === " ") shoot(); // Spacebar to shoot
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") player.isMovingLeft = false;
  if (e.key === "ArrowRight") player.isMovingRight = false;
});

// Shoot a bullet
function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 3,
    y: player.y,
    width: 6,
    height: 15,
    speed: 10
  });
}

// Update game state
async function update() {
  if (gameState !== 'PLAYING') return;

  // Move player
  if (player.isMovingLeft) player.x -= player.speed;
  if (player.isMovingRight) player.x += player.speed;

  // Keep player in bounds
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Move bullets
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    // Remove bullets off-screen
    if (bullet.y < 0) bullets.splice(index, 1);
  });

  // Check bullet-enemy collisions
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (
        enemy.isAlive &&
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

  // --- AI Enemy Shooting ---
  // Pick the first alive enemy as the "AI enemy"
  const aiEnemy = enemies.find(e => e.isAlive);
  if (aiEnemy) {
    const aiGameState = {
      player_x: player.x,
      bullets: bullets.map(b => ({ x: b.x, y: b.y })),
      enemies: enemies.filter(e => e.isAlive).map(e => ({ x: e.x, y: e.y }))
    };
    try {
      const aiResponse = await getAIMove(aiGameState);
      if (aiResponse.move.should_fire) {
        // Only shoot if not already a bullet from this enemy on screen
        const alreadyShot = enemyBullets.some(b => b.enemyId === aiEnemy.x + ',' + aiEnemy.y);
        if (!alreadyShot) {
          enemyBullets.push({
            x: aiEnemy.x + aiEnemy.width / 2 - 3,
            y: aiEnemy.y + aiEnemy.height,
            width: 6,
            height: 15,
            speed: 7,
            enemyId: aiEnemy.x + ',' + aiEnemy.y // To prevent spamming
          });
        }
      }
    } catch (e) {
      // Optionally log AI errors
    }
  }

  // Move enemy bullets
  enemyBullets.forEach((bullet, idx) => {
    bullet.y += bullet.speed;
    if (bullet.y > canvas.height) enemyBullets.splice(idx, 1);
    // Check collision with player
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      // Handle player hit (e.g., end game or reduce life)
      gameState = 'MENU'; // Example: go back to menu
      enemyBullets.splice(idx, 1);
    }
  });
}

// Draw menu
function drawMenu() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("SPACE INVADERS", canvas.width / 2, 150);
  ctx.font = "28px Arial";
  ctx.fillText("Press SPACE to start", canvas.width / 2, 250);
}

// Draw everything
function draw() {
  if (gameState === 'MENU') {
    drawMenu();
    return;
  }
  // Clear canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw enemies
  ctx.fillStyle = "red";
  enemies.forEach(enemy => {
    if (enemy.isAlive) {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });

  // Draw enemy bullets
  ctx.fillStyle = "cyan";
  enemyBullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 60, 25);
}

// Game loop
async function gameLoop() {
  await update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
initEnemies();
gameLoop();