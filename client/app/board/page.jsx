"use client";
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Single square component
const Square = ({ value, onClick }) => (
  <button className={`square ${value}`} onClick={onClick}>
    {value}
  </button>
);

// Main TicTacToe game component
const Board = ({ socket, gameStateInput }) => {
  const [gameState, setGameState] = useState(gameStateInput);
  const [board, setBoard] = useState(gameStateInput?.board || Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [playerTurn, setPlayerTurn] = useState('X');
  const [winner, setWinner] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") { // Check if it's running on the client
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }
}, []);

  useEffect(() => {
    if (socket) {
      socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
        // Attempt to reconnect
      });
      socket.on('startGame', (data) => {
        console.log('Starting game in board:', data);
        setGameState(data?.gameState);
        setBoard(data?.gameState?.board || Array(9).fill(null));
        setIsXNext(true);
      });

      socket.on('playerMoved', (data) => {
        console.log('Move received:', data.gameState);
        setGameState(data.gameState);
        setBoard(data.gameState.board);
        if (data.gameState.lastTurn === 'X') {
          setPlayerTurn('O');
          setIsXNext(false);
          console.log("setting isXNext to false");
        } else {
          setPlayerTurn('X');
          setIsXNext(true);
          console.log("setting isXNext to true");
        }
      });

      // Clean up the listeners on component unmount or when socket changes
      return () => {
        console.log("clean up!");
        socket.off('startGame');
        socket.off('playerOMoved');
        socket.off('playerXMoved');
      };
    } else {
      console.log("Socket not found");
    }
  }, [socket]); // Add socket as a dependency

  // Function to check for a winner and return the winning line
  const calculateWinner = (squares) => {
    console.log('Checking for winner:', squares);
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
  const isBoardFull = board.every(square => square !== null);
  const isTie = isBoardFull && !winnerInfo;

  // Update winner state
  useEffect(() => {
    if (winnerInfo) {
      setWinner(winnerInfo.winner);
    } else {
      setWinner(null);
    }
  }, [winnerInfo]);

  // useEffect(() => {
  //   emitMove();
  // }, [gameState]);

  useEffect(() => {
    console.log("isXNext updated:", isXNext);
}, [isXNext]);

  const handleClick = (index) => {
    if (
        board[index] || 
        winner || 
        (playerTurn === 'X' && username !== gameState.playerX) || 
        (playerTurn === 'O' && username !== gameState.playerO)
    ) return; // Ignore click if square is filled or game has a winner

    // Update the board with the new move
    const newBoard = board.slice();
    newBoard[index] = username === gameState.playerX ? 'X' : 'O';
    setBoard(newBoard);

    // Check if this move results in a winner
    const winnerInfo = calculateWinner(newBoard);

    // Create updated game state with winner and game status
    console.log( winnerInfo?.winner);
    const newGameState = {
        playerX: gameState.playerX,
        playerO: gameState.playerO,
        board: newBoard,
        roomID: gameState.roomID,
        lastTurn: isXNext ? 'X' : 'O',
        winner: winnerInfo ? winnerInfo?.winner : "none",
        status: winnerInfo?.winner ?"complete" : "incomplete",
        turnNumber: gameState.turnNumber + 1
    };

    // Update game state locally
    setGameState(newGameState);
    setWinner(winnerInfo ? winnerInfo.winner : null);

    // Emit the updated game state to the server
    if (socket) {
        socket.emit("playerMoved", { roomID: newGameState.roomID, gameState: newGameState });
    }
  };

  const renderSquare = (index) => (
    <Square
      value={board[index]}
      onClick={() => handleClick(index)}
      highlight={winnerInfo?.line.includes(index)} // Highlight square if it's part of the winning line
    />
  );

  return (
    <div className="tictactoe">
      <div className="status">
        {winner ? `Winner: ${winner}` : isTie ? "Tied game!" : `Next Player:` + (isXNext ? 'X' : 'O')}
      </div>
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
    </div>
  );
};
Board.propTypes = {
  socket: PropTypes.any.isRequired,
  gameStateInput: PropTypes.any.isRequired,
};

export default Board;
