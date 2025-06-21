from random import random
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/ai_move": {"origins": "http://localhost:8000"},  # Adjust port if needed
    r"/ping": {"origins": "*"}
})  # Enable CORS for all routes

# Mock AI decision maker (we'll replace this later)
def make_ai_decision(game_state):
    return {
        "move_x": -1 if game_state['player_x'] > 300 else 1,
        "should_fire": random.random() > 0.7
    }
@app.route('/')
def home():
    return jsonify({
        "message": "Space Invaders AI Server",
        "endpoints": {
            "/ai_move": "POST game state, get AI move",
            "/ping": "Health check"
        }
    })

@app.route('/ping')
def ping():
    return jsonify({"status": "alive", "version": "0.1"})

@app.route('/ai_move', methods=['POST'])
def ai_move():
    try:
        game_state = request.json
        decision = make_ai_decision(game_state)
        return jsonify({
            "move": decision,
            "confidence": 0.8  # Mock value
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)