"use client";
import { emit } from 'process';
import React, { useEffect, useState } from 'react';

// Single square component
const Square = ({ value, onClick }) => (
  <button className={`square ${value === 'X' ? "bg-red-500" : "bg-green-500"}`} onClick={onClick}>
    {value}
  </button>
);

// Main TicTacToe game component
const Board = ({ socket, roomID, gameStateInput }) => {
  const [gameState, setGameState] = useState(gameStateInput);
  const [board, setBoard] = useState(gameStateInput?.board || Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [playerTurn, setPlayerTurn] = useState('X');
  const [winner, setWinner] = useState(null);
  let gameStateCopy = gameStateInput;
  const [username, setUsername] = useState("dumb");
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
 
      socket.on('startGame2', (data) => {
        console.log('Starting game in board:', data);
      });

      socket.on("playerOMove", (data) => {
        console.log('Move from O received data.gameState:', data.gameState);
        console.log('Move from O received array:', data.gameState.board);
        setGameState(data.gameState);
        setBoard(data.gameState.board);
        setIsXNext(true);
      });

      socket.on('playerMoved', (data) => {
        console.log('Move received:', data.gameState);
        setGameState(data.gameState);
        setBoard(data.gameState.board);
        console.log("last move: ", data.gameState.lastMove);
        console.log("last move = x? : ", data.gameState.lastMove === 'X');
        if (data.gameState.lastMove === 'X') {
          setPlayerTurn('O');
          setIsXNext(false);
          console.log("setting isXNext to false");
        } else {
          setPlayerTurn('X');
          setIsXNext(true);
          console.log("setting isXNext to true");
        }
        
      });

      socket.on('test', (data) => {
        console.log('test:');
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
    console.log("x turn but O player clicked: " + {isXNext} && username !== gameState.playerX);
    console.log("is not x turn but X player clicked: " + ({isXNext} && username !== gameState.playerX));
    
    if (board[index] || winner || (playerTurn === 'X' && username !== gameState.playerX) || (playerTurn === 'O' && username !== gameState.playerO)
        ) return; // Ignore click if square is filled or game has a winner

    // Update the board
    const newBoard = board.slice();
    // console.log("player X gameState: " + gameState.playerX);
    // console.log("username: " + username);
    newBoard[index] = username === gameState.playerX ? 'X' : 'O';
    console.log("new board: ", newBoard);
    setBoard(newBoard);
    //setIsXNext(!isXNext);
    gameStateCopy = { 
      playerX: gameState.playerX, 
      playerO: gameState.playerO,
      board: newBoard, 
      roomID: gameState.roomID,
      lastMove: isXNext ? 'X' : 'O' };

    if (socket) {
      const signal = "playerMoved";
      console.log("emit move: ", signal);
      socket.emit("playerMoved", { roomID: gameStateCopy.roomID, gameState: gameStateCopy });
    }
    
    // Update game state and emit the move
    setGameState({ 
      playerX: gameState.playerX, 
      playerO: gameState.playerO, 
      board: newBoard, 
      roomID: gameState.roomID,
      lastMove: isXNext ? 'X' : 'O' });
    console.log("gamestate: ", gameState);
    //emitMove();
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

export default Board;
