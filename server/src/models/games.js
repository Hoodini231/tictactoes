import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    gameID: {
        type: String,
        required: true,
    },
    playerX: {
        type: String,
        required: true
    },
    playerO: {
        type: String,
        required: true
    },
    board: {
        type: Array,
        required: true
    },
    lastTurn: {
        type: String,
        default: null
    },
    winner: {
        type: String,
        default: null
    },
    status: {
        type: String,
        required: true
    }, 
    turnNumber: {
        type: Number,
        required: true
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

const Game = mongoose.model('game', gameSchema);
export default Game;
