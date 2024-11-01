"use client";
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Board from '../board/page.tsx';


const Game = () => {
    // const [roomID, setRoomID] = useState(uuidv4()); // Generate unique room ID;
    // const [myTurn, setMyTurn] = useState(true);
    const [mySymbol, setMySymbol] = useState('?');
    // const [gameState, setGameState] = useState({playerX: null, playerY: null, roomId: null, lastMove: null, board: Array(9).fill(null)});
    const [opponentData, setOpponentData] = useState("Waiting...");
    const [username, setUsername] = useState("");
    //const [socket, setSocket] = useState(null);



    useEffect(() => {
        // Connect to WebSocket server
        const newSocket = io("https://tictactoes-5foa.onrender.com", { withCredentials: true});
        //setSocket(newSocket);
        

        if (typeof window !== "undefined") { // Check if it's running on the client
            const storedUsername = sessionStorage.getItem("username");
            if (storedUsername) {
                setUsername(storedUsername);
                console.log("never reached");
                newSocket.emit("joinQueue", { username: storedUsername });
                
            }
        }

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        // Join a room on server
        //newSocket.emit("joinQueue", { roomID: roomID, username: username });

        newSocket.on("opponentFound", (data) => {
            sessionStorage.setItem('roomID', data);
            setOpponentData(data);
            
        });

        newSocket.on("roomIdGenerated", (data) => {
            sessionStorage.setItem('roomID', data);
            console.log("Room ID generated: ", data);
        });

        newSocket.on('startGame', (data) => {
            console.log('Starting game:', data);
            console.log('data gamestate room id: ', data.gameState);
            sessionStorage.setItem('roomID', data.gameState.roomID);
            // setGameState(data.gameState);
            setMySymbol(data.symbol);
            // setMyTurn(data.myTurn);
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
    },[]);

    return (
        
        <div className="game-container relative flex flex-col items-center gap-4 p-6 w-screen h-screen bg-gradient-to-b from-blue-900 to-purple-700">
            <button 
                className="back-button absolute top-4 left-40 px-4 py-2 bg-white text-black font-bold rounded hover:bg-blue-600"
                onClick={() => window.history.back()}
            >
                Back
            </button>
            
            <div>
            <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between gap-2 mb-8">
                <Card className="w-full sm:w-[calc(50%-0.5rem)]">
                <CardHeader>
                    <CardTitle>You</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{username}</p>
                    {opponentData === "Waiting..." ? (
                        <></>
                    ) :(
                        <>
                        <p className={`text-lg`}>[Playing as {mySymbol}]</p>
                        <p className={`text-lg text${mySymbol}`}>[Is color {mySymbol === "X" ? "Red" : "Green"}]</p>
                        </>
                        )
                    }
                    
                    {/* Add more player details here if needed */}
                </CardContent>
                </Card>
        
                <Card className="w-full sm:w-[calc(50%-0.5rem)]">
                <CardHeader>
                    <CardTitle>Opponent</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{opponentData}</p>
                    { opponentData === "Waiting..." ? (
                        <></>
                        ):(
                            <>
                                <p className={`text-lg`}>[Playing as {mySymbol === "X" ? "O" : "X"}]</p>
                                <p className={`text-lg text${mySymbol === "X" ? "O" : "X"}`}>[Is color {mySymbol === "X" ? "Green" : "Red"}]</p>
                            </>
                        )
                    }
                </CardContent>
                </Card>
            </div>
                {opponentData === "Waiting..." ? (
                    <div className="loading mt-4 flex flex-col items-center justify-center">
                    <div className="spinner border-4 border-t-4 border-white border-opacity-50 rounded-full w-8 h-8 animate-spin"></div>
                    <p className="mt-2 text-white">Waiting...</p>
                </div>
                    
                ) : (
                    <Board />
                )}
        </div>
        </div>
    );
};

export default Game;
