import React, { useState } from 'react';

const Game = () => {
    const [grid, setGrid] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    const handleClick = (index) => {
        if (grid[index] || calculateWinner(grid)) {
            return;
        }

        const newGrid = [...grid];
        newGrid[index] = xIsNext ? 'X' : 'O';

        setGrid(newGrid);
        setXIsNext(!xIsNext);
    };

    const renderCell = (index) => {
        return (
            <div className="cell" onClick={() => handleClick(index)}>
                {grid[index]}
            </div>
        );
    };

    const winner = calculateWinner(grid);
    const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div className="game">
            <h1>Penis</h1>
            <div className="grid">
                {grid.map((cell, index) => (
                    <div key={index} className="row">
                        {renderCell(index)}
                    </div>
                ))}
            </div>
            <div className="status">{status}</div>
        </div>
    );
};

// Helper function to calculate the winner
const calculateWinner = (grid) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
            return grid[a];
        }
    }

    return null;
};

export default Game;