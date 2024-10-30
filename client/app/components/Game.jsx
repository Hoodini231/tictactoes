import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from "uuid";
import Board from './Board';

const Game = () => {
    const cookies = new Cookies();
    const [roomID, setRoomID] = useState(uuidv4()); // Generate unique room ID
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [opponentData, setOpponentData] = useState("Waiting...");

    // useEffect(() => {
    //     const newSocket = io("http://localhost:3001");
    //     setSocket(newSocket);
    //     newSocket.on('connected', (message) => {
    //         console.log('Connected message from server:', message);
    //     })

    //     return () => {
    //         newSocket.disconnect();
    //     };
    // })

    useEffect(() => {
        // Connect to WebSocket server
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        newSocket.on("connected", (message) => {
            console.log("Connected message from server:", message);
        });

        // Join a room on server
        newSocket.emit("joinQueue", { roomID: roomID, username: cookies.get("username") });

        newSocket.on('dataFromServer', ({ data }) => {
            console.log('Data received from server:', data);
            // Handle the received data here
        });

        newSocket.on("opponentFound", (data) => {
            console.log("Opponent found!");
            console.log(data);
            setOpponentData(data);
        });

        newSocket.on('startGame', (data) => {
            console.log('Move received:', data);
            //setGameState(data); // Update game state with received data
        });

        newSocket.on('move', (data) => {
            console.log('Move received:', data);
            setGameState(data); // Update game state with received data
        });

        // Clean up on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, [roomID]);

    return (
        <div className="game-container relative flex flex-col items-center gap-4 p-6 w-screen">
            <button 
                className="back-button absolute top-4 left-40 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                onClick={() => window.history.back()}
            >
                Back
            </button>
            
            <div className="players-info flex gap-4">
                <div className="player-card bg-gray-800 text-white p-6 rounded-lg shadow-md w-full max-w-xs text-center">
                    <strong className="block text-lg mb-2">You:</strong>
                    <span className="text-xl font-semibold">{cookies.get("username")}</span>
                </div>
                
                <div className="player-card bg-gray-800 text-white p-6 rounded-lg shadow-md w-full max-w-xs text-center">
                    <strong className="block text-lg mb-2">Opponent:</strong>
                    <span className="text-xl font-semibold">{opponentData}</span>
                </div>
            </div>
            
            <div className="playing-as text-white text-lg font-semibold mt-4">
                <strong>You are playing as:</strong> X
            </div>
            
            <Board socket={socket} roomID={roomID} />
            
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
