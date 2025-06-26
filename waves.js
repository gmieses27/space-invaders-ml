// Each wave returns an array of enemy objects with custom properties
export const waves = [
    // Wave 1: Galaga-style, 5 rows × 10 columns
    () => {
        const enemies = [];
        for (let row = 0; row < 5; row++) { // 5 rows
            for (let col = 0; col < 10; col++) { // 10 columns
                enemies.push({
                    x: col * 50 + 30, // tighter spacing for more enemies
                    y: row * 40 + 30,
                    width: 36,
                    height: 28,
                    isAlive: true,
                    type: 'galaga',
                    direction: Math.random() < 0.5 ? -1 : 1,
                    row, col
                });
            }
        }
        return enemies;
    },
    // Wave 2: mix of sine and sniper enemies
    () => {
        const enemies = [];
        for (let i = 0; i < 3; i++) { // Sine enemies
            enemies.push({
                x: i * 120 + 60,
                y: 60,
                width: 40,
                height: 30,
                isAlive: true,
                type: 'sine',
                speed: 3,
                phase: i,
                row: 0, col: i
            });
        }
        for (let i = 0; i < 3; i++) { // Sniper enemies
            enemies.push({
                x: i * 120 + 120,
                y: 200,
                width: 40,
                height: 30,
                isAlive: true,
                type: 'sniper',
                row: 1, col: i + 3
            });
        }
        return enemies;
    }
];

export function loadWave(waveNumber) {
    if (waves[waveNumber]) {
        return waves[waveNumber]();
    }

    return waves[waves.length - 1]();
}