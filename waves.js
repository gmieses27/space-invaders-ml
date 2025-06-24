// Each wave returns an array of enemy objects with custom properties
export const waves = [
    // Wave 1: simple Galaga-style
    () => {
        const enemies = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                enemies.push({
                    x: col * 70 + 30,
                    y: row * 50 + 30,
                    width: 40,       
                    height: 30,      
                    isAlive: true,   
                    type: 'galaga',  
                    direction: Math.random() < 0.5 ? -1 : 1, 
                    row, col
                });
            }
        }
        return enemies;
    },
    // Wave 2: fewer, faster, sine-wave enemies
    () => {
        const enemies = [];
        for (let i = 0; i < 6; i++) { 
            enemies.push({
                x: i * 90 + 60,  
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
        return enemies;
    }

];

export function loadWave(waveNumber) {
    if (waves[waveNumber]) {
        return waves[waveNumber]();
    }

    return waves[waves.length - 1]();
}