"use client";
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from "uuid";
import Board from '../board/page';


const Game = () => {
    const [roomID, setRoomID] = useState(uuidv4()); // Generate unique room ID;
    const [myTurn, setMyTurn] = useState(true);
    const [mySymbol, setMySymbol] = useState('?');
    const [gameState, setGameState] = useState({playerX: null, playerY: null, roomId: null, lastMove: null, board: Array(9).fill(null)});
    const [opponentData, setOpponentData] = useState("Waiting...");
    const [username, setUsername] = useState("");
    const [socket, setSocket] = useState(null);


    useEffect(() => {
        // Connect to WebSocket server
        console.log("arrived");
        const newSocket = io("http://localhost:5001", { withCredentials: true});
        setSocket(newSocket);
        

        if (typeof window !== "undefined") { // Check if it's running on the client
            const storedUsername = sessionStorage.getItem("username");
            if (storedUsername) {
                setUsername(storedUsername);
                console.log("never reached");
                newSocket.emit("joinQueue", { roomID: roomID, username: storedUsername });
                
            }
        }

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        // Join a room on server
        //newSocket.emit("joinQueue", { roomID: roomID, username: username });

        newSocket.on("opponentFound", (data) => {
            setOpponentData(data);
        });

        newSocket.on('startGame', (data) => {
            console.log('Starting game:', data);
            setGameState(data.gameState);
            setMySymbol(data.symbol);
            setMyTurn(data.myTurn);
            setOpponentData(data.opponent);
            //setGameState(data); // Update game state with received data
        });

        newSocket.on('gameOver', (data) => {
            console.log('Game over:', data);
            setGameState(data); // Update game state with received data
        });
    

        // Clean up on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, [roomID]);

    return (
        <div className="game-container relative flex flex-col items-center gap-4 p-6 w-screen h-screen bg-gray-900">
            <button 
                className="back-button absolute top-4 left-40 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                onClick={() => window.history.back()}
            >
                Back
            </button>
            
            <div className="players-info flex gap-4">
                <div className="player-card bg-gray-500 text-white p-6 rounded-lg shadow-md w-full max-w-xs text-center">
                    <strong className="block text-lg mb-2">You:</strong>
                    <span className="text-xl font-semibold">{username}</span>
                </div>
                
                <div className="player-card bg-gray-500 text-white p-6 rounded-lg shadow-md w-full max-w-xs text-center">
                    <strong className="block text-lg mb-2">Opponent:</strong>
                    <span className="text-xl font-semibold">{opponentData}</span>
                </div>
            </div>
            
            <div className="playing-as text-white text-4xl font-semibold mt-4">
                <strong>You are playing as: </strong>{mySymbol}
            </div>
            <div>
                {opponentData === "Waiting..." ? (
                    <div className="loading mt-4 flex items-center justify-center">
                        <div className="spinner border-4 border-t-4 border-white border-opacity-50 rounded-full w-8 h-8 animate-spin"></div>
                    </div>
                ) : (
                    <Board socket={socket} roomID={roomID} gameStateInput = {gameState} />
                )}
            </div>
            
            
            
            {/* <div className="turn-info text-white text-lg font-bold mt-4">
                <strong>{myTurn ? mySymbol : mySymbol === 'X' ? 'O' : 'X'}'s turn</strong>
            </div> */}
            
            
        </div>
    );
};

export default Game;
