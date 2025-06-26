export function updateEnemies(enemies, enemyBullets, gameTime, canvas) {
    enemies.forEach((enemy, idx) => {
        if (!enemy.isAlive) return;

        if (enemy.type === 'galaga') {
            // Galaga-style movement (classic wave pattern)
            const { row, col } = enemy;
            const baseX = col * 70 + 30;
            const amplitude = 20 + row * 10;
            const frequency = 0.02 + row * 0.005;
            enemy.x = baseX + Math.sin(gameTime * frequency + row) * amplitude;
            const baseY = row * 50 + 30; 
            enemy.y = baseY + Math.sin(gameTime * 0.03 + col) * 8;
        } else if (enemy.type === 'sine') {
            enemy.x += Math.sin(gameTime * 0.1 + enemy.phase) * enemy.speed;
        }

        if (Math.random() < 0.008) {
            enemyBullets.push({
                x: enemy.x + enemy.width / 2 - 3,
                y: enemy.y + enemy.height,
                width: 6,      
                height: 15,    
                speed: 3
            });
        }
    });
}