"use client";
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface SquareProps {
  value: string | null;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => (
  <button className={`square ${value}`} onClick={onClick}>
    {value}
  </button>
);

interface GameState {
  playerX: string;
  playerO: string;
  board: (string | null)[];
  roomID: string;
  lastTurn: string;
  winner: string | null;
  status: string;
  turnNumber: number;
}

const Board: React.FC<{ socket: Socket | null }> = ({ socket }) => {
  const [gameState, setGameState] = useState<GameState>({
    playerX: "",
    playerO: "",
    board: Array(9).fill(null),
    roomID: "",
    lastTurn: "",
    winner: null,
    status: "",
    turnNumber: 0
  });
  const [board, setBoard] = useState<(string | null)[]>(gameState?.board || Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [playerTurn, setPlayerTurn] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

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
      socket.on('disconnect', () => {
        console.log('Disconnected from server:');
        // Attempt to reconnect
      });

      socket.on('startGame', (data: { gameState: GameState }) => {
        console.log('Starting game in board:', data);
        setGameState(data?.gameState);
        setBoard(data?.gameState?.board || Array(9).fill(null));
        setIsXNext(true);
      });

      socket.on('playerMoved', (data: { gameState: GameState }) => {
        console.log('Move received:', data.gameState);
        setGameState(data.gameState);
        setBoard(data.gameState.board);
        setPlayerTurn(data.gameState.lastTurn === 'X' ? 'O' : 'X');
        setIsXNext(data.gameState.lastTurn !== 'X');
      });

      // Clean up the listeners on component unmount or when socket changes
      return () => {
        console.log("clean up!");
        socket.off('startGame');
        socket.off('playerMoved');
      };
    } else {
      console.log("Socket not found");
    }
  }, [socket]); // Add socket as a dependency

  const calculateWinner = (squares: (string | null)[]) => {
    console.log('Checking for winner:', squares);
    const winningLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of winningLines) {
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

  useEffect(() => {
    if (winnerInfo) {
      setWinner(winnerInfo.winner);
    } else {
      setWinner(null);
    }
  }, [winnerInfo]);

  const handleClick = (index: number) => {
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
    console.log(winnerInfo?.winner);
    const newGameState: GameState = {
      playerX: gameState.playerX,
      playerO: gameState.playerO,
      board: newBoard,
      roomID: gameState.roomID,
      lastTurn: isXNext ? 'X' : 'O',
      winner: winnerInfo ? winnerInfo?.winner : "none",
      status: winnerInfo?.winner ? "complete" : "incomplete",
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

  const renderSquare = (index: number) => (
    <Square
      value={board[index]}
      onClick={() => handleClick(index)}
    />
  );

  return (
    <div className="tictactoe">
      <div className="status">
        {winner ? `Winner: ${winner}` : isTie ? "Tied game!" : `Next Player: ${isXNext ? 'X' : 'O'}`}
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
