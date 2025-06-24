import { updateEnemies } from './enemy.js';
import { loadWave } from './waves.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 20,
    speed: 5,
    color: '#0f0'
};

const bullets = [];
const enemies = [];
const enemyBullets = [];
let score = 0;

let gameTime = 0;
let currentWave = 0;

function initEnemies() {
    enemies.length = 0;
    bullets.length = 0;
    enemyBullets.length = 0;
    const newEnemies = loadWave(currentWave);
    newEnemies.forEach(e => enemies.push(e));
}

let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'ArrowUp') upPressed = true;
    if (e.key === 'ArrowDown') downPressed = true;
    if (e.key === ' ') shoot();
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
    if (e.key === 'ArrowUp') upPressed = false;
    if (e.key === 'ArrowDown') downPressed = false;
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

function update() {
    gameTime += 1;

    if (leftPressed) player.x -= player.speed;
    if (rightPressed) player.x += player.speed;
    if (upPressed) player.y -= player.speed;
    if (downPressed) player.y += player.speed;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    updateEnemies(enemies, enemyBullets, gameTime, canvas);

    enemyBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) enemyBullets.splice(index, 1);

        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            alert("Game Over! Final Score: " + score);
            initEnemies();
            score = 0;
            player.x = canvas.width / 2 - 25;
            player.y = canvas.height - 60;

            leftPressed = false;
            rightPressed = false;
            upPressed = false;
            downPressed = false;
        }
    });

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

    if (enemies.every(e => !e.isAlive)) {
        currentWave++;
        initEnemies();
    }
}

function draw() {

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = '#ff0';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    ctx.fillStyle = '#f00';
    enemies.forEach(enemy => {
        if (enemy.isAlive) {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });

    ctx.fillStyle = '#0ff';
    enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

initEnemies();
gameLoop();