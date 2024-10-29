import React from 'react';
import Cookies from 'universal-cookie';
import Board from './Board';

const Game = () => {
    const cookies = new Cookies();
    return (
        <div className="game-container relative flex flex-col items-center gap-4 p-6 w-screen">
            <button 
                className="back-button absolute top-4 left-40 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                onClick={() => window.history.back()}
            >
                Back
            </button>
            
            <div className="players-info flex gap-4">
                {/* Individual card for You */}
                <div className="player-card bg-gray-800 text-white p-6 rounded-lg shadow-md w-full max-w-xs text-center">
                    <strong className="block text-lg mb-2">You:</strong>
                    <span className="text-xl font-semibold">{cookies.get("username")}</span>
                </div>
                
                {/* Individual card for Opponent */}
                <div className="player-card bg-gray-800 text-white p-6 rounded-lg shadow-md w-full max-w-xs text-center">
                    <strong className="block text-lg mb-2">Opponent:</strong>
                    <span className="text-xl font-semibold">Player 2</span>
                </div>
            </div>
            
            <div className="playing-as text-white text-lg font-semibold mt-4">
                <strong>You are playing as:</strong> X
            </div>
            
            <Board />
            
            <div className="turn-info text-white text-lg font-bold mt-4">
                <strong>X's turn</strong>
            </div>
            
            <div className="loading mt-4 flex items-center justify-center">
                <div className="spinner border-4 border-t-4 border-white border-opacity-50 rounded-full w-8 h-8 animate-spin"></div>
            </div>
        </div>
    );
};

export default Game;