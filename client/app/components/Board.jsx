import React, { useState } from 'react';

// Single square component
const Square = ({ value, onClick, highlight }) => (
  <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onClick}>
    {value}
  </button>
);

// Main TicTacToe game component
const Board = () => {
  // Initialize the board as an array of 9 nulls, representing empty squares
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // Function to check for a winner and return the winning line
  const calculateWinner = (squares) => {
    const winningLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let [a, b, c] of winningLines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        console.log(`Winner found: ${squares[a]} at indices ${a}, ${b}, ${c}`);
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];

  const handleClick = (index) => {
    if (board[index] || winner) return; // Ignore click if square is filled or game has a winner

    // Update the board
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const renderSquare = (index) => (
    <Square
      value={board[index]}
      onClick={() => handleClick(index)}
      highlight={winningLine.includes(index)} // Highlight square if it's part of the winning line
    />
  );

  return (
    <div className="tictactoe">
      <div className="board">
        <div className="row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <div className="status">
        {winner ? `Winner: ${winner}` : `Next Player: ${isXNext ? 'X' : 'O'}`}
      </div>
      <button className="reset-button" onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default Board;
