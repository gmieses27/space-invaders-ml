export async function getAIMove(gameState) {
    const response = await fetch('http://localhost:5000/ai_move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameState)
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
}

// Example usage in game.js:
// const aiResponse = await getAIMove({
//   player_x: player.x,
//   bullets: bullets.map(b => ({x: b.x, y: b.y}))
// });