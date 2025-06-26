export function updateEnemies(enemies, enemyBullets, gameTime, canvas, player) {
    // Find bottom-most alive enemy in each column (for galaga shooters)
    const bottomEnemies = {};
    enemies.forEach(enemy => {
        if (!enemy.isAlive) return;
        if (
            bottomEnemies[enemy.col] === undefined ||
            enemy.row > bottomEnemies[enemy.col].row
        ) {
            bottomEnemies[enemy.col] = enemy;
        }
    });

    enemies.forEach((enemy, idx) => {
        if (!enemy.isAlive) return;

        if (enemy.type === 'galaga') {
            // Galaga-style movement
            const { row, col } = enemy;
            const baseX = col * 50 + 30;
            const amplitude = 20 + row * 10;
            const frequency = 0.02 + row * 0.005;
            enemy.x = baseX + Math.sin(gameTime * frequency + row) * amplitude;
            const baseY = row * 40 + 30;
            enemy.y = baseY + Math.sin(gameTime * 0.03 + col) * 8;

            // Only bottom-most alive enemy in each column can shoot
            if (
                bottomEnemies[enemy.col] === enemy &&
                Math.random() < 0.002
            ) {
                enemyBullets.push({
                    x: enemy.x + enemy.width / 2 - 3,
                    y: enemy.y + enemy.height,
                    width: 6,
                    height: 15,
                    speed: 3,
                    type: 'normal'
                });
            }
        } else if (enemy.type === 'sine') {
            // Sine wave movement
            enemy.x += Math.sin(gameTime * 0.1 + enemy.phase) * enemy.speed;

            // Sine enemies shoot faster, but normal bullets
            if (Math.random() < 0.01) {
                enemyBullets.push({
                    x: enemy.x + enemy.width / 2 - 3,
                    y: enemy.y + enemy.height,
                    width: 6,
                    height: 15,
                    speed: 5,
                    type: 'normal'
                });
            }
        } else if (enemy.type === 'sniper') {
            // Sniper: stays mostly still, fires directly at player but less often
            // (optional: add a little horizontal bobbing)
            enemy.x += Math.sin(gameTime * 0.03 + idx) * 1;

            if (Math.random() < 0.004 && player) {
                // Fire a "sniper" bullet directly at the player
                const dx = (player.x + player.width / 2) - (enemy.x + enemy.width / 2);
                const dy = (player.y + player.height / 2) - (enemy.y + enemy.height);
                const mag = Math.sqrt(dx * dx + dy * dy);
                const speed = 6;
                enemyBullets.push({
                    x: enemy.x + enemy.width / 2 - 3,
                    y: enemy.y + enemy.height,
                    width: 6,
                    height: 15,
                    speedX: dx / mag * speed,
                    speedY: dy / mag * speed,
                    type: 'sniper'
                });
            }
        }
    });
}