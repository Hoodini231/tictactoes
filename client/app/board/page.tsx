"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

interface SquareProps {
  value: string | null;
  onClick: () => void;
  onFocus: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const indexToLocationMap: { [index: number]: string } = {
  0: "top left",
  1: "middle left",
  2: "bottom left",
  3: "top center",
  4: "middle center",
  5: "bottom center",
  6: "top right",
  7: "middle right",
  8: "bottom right"
};

const Square: React.FC<SquareProps> = ({ value, onClick, onFocus, onMouseEnter, onMouseLeave }) => (
  <button aria-label={`${value === 'X' ? 'X filled box' : 'Y filled box'}`} 
  className={`square ${value}`} 
  onClick={onClick}
  onFocus={onFocus}
  onMouseEnter={onMouseEnter}
  onMouseLeave={onMouseLeave}>
    {value}
  </button>
);

const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};

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

const Board: React.FC = () => {
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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomID, setRoomID] = useState<string>("");
  const [focusedSquare, setFocusedSquare] = useState<number | null>(null);

  useEffect(() => {
    try {
      const currentPlayer = isXNext ? gameState.playerX : gameState.playerO;
      if (currentPlayer) {
        speak(`It's ${currentPlayer}'s turn`);
      }
    } catch(err) {
      console.error(err);
    }

    
  }, [isXNext, gameState.playerX, gameState.playerO]);

  useEffect(() => {
    if (focusedSquare !== null) {
      const locationText = indexToLocationMap[focusedSquare];
      speak(`Focused on ${locationText}`);
    }
  }, [focusedSquare]);


  useEffect(() => {
    if (typeof window !== "undefined") { // Check if it's running on the client
      const storedUsername = sessionStorage.getItem("username");
      const storedRoomID = sessionStorage.getItem("roomID");
      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (storedRoomID) {
        setRoomID(storedRoomID);
      }
    }
  }, []);

  useEffect(() => {
    const socket = io("https://tictactoes-5foa.onrender.com", { withCredentials: true});
    // const socket = io("http://localhost:5001", { withCredentials: true});
    setSocket(socket);
    if (typeof window !== "undefined") {
      socket.emit("boardSocketJoin", sessionStorage.getItem("roomID"));
    }

    if (socket) {
      socket.on("boardSocketJoinedSuccessful", (data: { gameState: GameState }) => {
        setGameState(data?.gameState);
        setBoard(data?.gameState?.board || Array(9).fill(null));
        setIsXNext(true);
      });

      socket.on('startGame', (data: { gameState: GameState }) => {
        setGameState(data?.gameState);
        setBoard(data?.gameState?.board || Array(9).fill(null));
        setIsXNext(true);
      });

      socket.on('playerMoved', (data: { gameState: GameState }) => {
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
  }, [roomID]); // Add socket as a dependency

  const calculateWinner = (squares: (string | null)[]) => {
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
    ) return; 

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
      if (winnerInfo) {
        socket.emit("playerWon", { roomID: newGameState.roomID, gameState: newGameState });
      } else {
        socket.emit("playerMoved", { roomID: newGameState.roomID, gameState: newGameState });
      }
    }
  };

  const renderSquare = (index: number) => (
    <Square
      aria-label={`Box at ${indexToLocationMap[index]}`}
      value={board[index]}
      onClick={() => handleClick(index)}
      onFocus={() => setFocusedSquare(index)}
      onMouseEnter={() => setFocusedSquare(index)}
      onMouseLeave={() => setFocusedSquare(null)}
    />
  );

  return [
  <div className="game-container flex" key="board-and-gameinfo-container">
  <div className="tictactoe items-center" key="board-container">
    <div aria-label={winner ? `Winner: ${winner}` : isTie ? "Tied game!" : `Next Player: ${isXNext ? 'X' : 'O'} label`} className="status">
      <p className="text-2xl font-bold text-center mb-4">{winner ? `Winner: ${winner}` : isTie ? "Tied game!" : `Player Turn: ${isXNext ? gameState.playerX + ' (X)' : gameState.playerO + '(O)'}  `}</p>
    </div>
    <div aria-label="tic tac toe board" className="board">
      <div aria-label="column 1" className="row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div aria-label="column 2" className="row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div aria-label="column 3" className="row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  </div>
  {focusedSquare !== null && (
      <Card aria-label="focus square card" className="ml-12 mb-3" style={{ width: '450px', height:'100px' }}>
        <CardHeader>
          <CardTitle>Focused Square</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{`Focused on ${indexToLocationMap[focusedSquare]}`}</p>
        </CardContent>
      </Card>
        )}
  <Card aria-label="Game info card" className="game-info-card ml-12" style={{ width: '450px' }}>
    <CardHeader>
      <CardTitle>Game Info</CardTitle>
    </CardHeader>
    <CardContent>
      <p aria-label="Room ID label"><strong>Room ID:</strong> {gameState.roomID}</p>
      <p aria-label="Turn number label"><strong>Turn Number:</strong> {gameState.turnNumber}</p>
      <p aria-label="How to win label"><strong>How to win:</strong> Get 3 of your symbols (X or O) in a row!</p>
      <p aria-label="How to play"><strong>How to play:</strong> Player X starts first, then player O and X alternate turns. Either use [TAB] or mouse to select an empty cell, which will highlight blue, then click or press [ENTER] to place your symbol there.</p>
    </CardContent>
  </Card>
</div>

  ];
};

export default Board;
