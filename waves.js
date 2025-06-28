// Each wave returns an array of enemy objects with custom properties
export const waves = [
    // Wave 1: Classic Galaga grid
    () => {
        const enemies = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 10; col++) {
                enemies.push({
                    x: col * 50 + 30,
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
    // Wave 2: Sine and Sniper mix
    () => {
        const enemies = [];
        for (let i = 0; i < 5; i++) { // Sine enemies
            enemies.push({
                x: i * 100 + 60,
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
        for (let i = 0; i < 5; i++) { // Sniper enemies
            enemies.push({
                x: i * 100 + 60,
                y: 200,
                width: 40,
                height: 30,
                isAlive: true,
                type: 'sniper',
                health: 2, // <-- Add this line
                row: 1, col: i
            });
        }
        return enemies;
    },
    // Wave 3: Fast zig-zag enemies
    () => {
        const enemies = [];
        for (let i = 0; i < 8; i++) {
            enemies.push({
                x: i * 70 + 50,
                y: 50,
                width: 32,
                height: 28,
                isAlive: true,
                type: 'zigzag',
                speed: 5,
                phase: i,
                row: 0, col: i
            });
        }
        return enemies;
    },
    // Wave 4: "Boss" enemy with minions
    () => {
        const enemies = [];
        // Boss enemy (large, lots of health, shoots bursts)
        enemies.push({
            x: 250,
            y: 60,
            width: 100,
            height: 60,
            isAlive: true,
            type: 'boss',
            health: 30,
            row: 0, col: 0
        });
        // Minions (circle around boss)
        for (let i = 0; i < 6; i++) {
            enemies.push({
                x: 300 + Math.cos(i * Math.PI / 3) * 80,
                y: 90 + Math.sin(i * Math.PI / 3) * 80,
                width: 24,
                height: 24,
                isAlive: true,
                type: 'minion',
                orbitAngle: i * Math.PI / 3,
                orbitRadius: 80,
                orbitSpeed: 0.02 + i * 0.005,
                row: 1, col: i
            });
        }
        return enemies;
    }
];

export function loadWave(waveNumber) {
    if (waves[waveNumber]) {
        return waves[waveNumber]();
    }
    // Loop last wave if out of bounds
    return waves[waves.length - 1]();
}