"use client";

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Board from '../board/page.tsx';

const Game = () => {
    const [mySymbol, setMySymbol] = useState('?');
    const [opponentData, setOpponentData] = useState("Waiting...");
    const [username, setUsername] = useState("");
    useEffect(() => {
        const newSocket = io("https://tictactoes-5foa.onrender.com", { withCredentials: true});
        // const newSocket = io("http://localhost:5001", { withCredentials: true});
        if (typeof window !== "undefined") { // Check if it's running on the client
            const storedUsername = sessionStorage.getItem("username");
            if (storedUsername) {
                setUsername(storedUsername);
                newSocket.emit("joinQueue", { username: storedUsername });
            }
        }

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        newSocket.on("opponentFound", (data) => {
            sessionStorage.setItem('roomID', data);
            setOpponentData(data);
            
        });

        newSocket.on("roomIdGenerated", (data) => {
            sessionStorage.setItem('roomID', data);
            console.log("Room ID generated: ", data);
        });

        newSocket.on('startGame', (data) => {
            sessionStorage.setItem('roomID', data.gameState.roomID);
            setMySymbol(data.symbol);
            setOpponentData(data.opponent);
        });

        newSocket.on('gameOver', (data) => {
            setGameState(data); // Update game state with received data
        });
    
        // Clean up on component unmount
        return () => {
            newSocket.disconnect();
        };
    },[]);

    return (
        <div className="game-container relative flex flex-col items-center gap-4 p-6 w-screen min-h-screen bg-gradient-to-b from-blue-900 to-purple-700">
            <button 
                aria-label="Back button"
                className="back-button absolute top-4 left-40 px-4 py-2 bg-white text-black font-bold rounded hover:bg-green-600 focus:bg-green-500"
                onClick={() => window.history.back()}
            >
                Back
            </button>
            <div>
            <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between gap-2 mb-8">
                <Card aria-label="Your information card" className="w-full sm:w-[calc(50%-0.5rem)]">
                <CardHeader>
                    <CardTitle>You</CardTitle>
                </CardHeader>
                <CardContent>
                    <p aria-label="Your username label" className="text-2xl font-bold">{username}</p>
                    {opponentData === "Waiting..." ? (
                        <></>
                    ) :(
                        <>
                        <p aria-label={`Playing as ${mySymbol} label`} className={`text-lg`}>[Playing as {mySymbol}]</p>
                        <p aria-label={`Playing as color ${mySymbol === "X" ? "Red" : "Green"} label`} className={`text-lg text${mySymbol}`}>[Is color {mySymbol === "X" ? "Red" : "Green"}]</p>
                        </>
                        )
                    }
                    
                    {/* Add more player details here if needed */}
                </CardContent>
                </Card>
        
                <Card aria-label="Opponent information card" className="w-full sm:w-[calc(50%-0.5rem)]">
                <CardHeader>
                    <CardTitle>Opponent</CardTitle>
                </CardHeader>
                <CardContent>
                    <p aria-label={`${opponentData === "Waiting..." ? 'Opponent has not joined yet' : opponentData} `} className="text-2xl font-bold">{opponentData}</p>
                    { opponentData === "Waiting..." ? (
                        <></>
                        ):(
                            <>
                                <p aria-label={`Opponent playing as ${mySymbol === "X" ? "O" : "X"} label`} className={`text-lg`}>[Playing as {mySymbol === "X" ? "O" : "X"}]</p>
                                <p aria-label={`Opponent playing as color ${mySymbol === "X" ? "Green" : "Red"} label`}className={`text-lg text${mySymbol === "X" ? "O" : "X"}`}>[Is color {mySymbol === "X" ? "Green" : "Red"}]</p>
                            </>
                        )
                    }
                </CardContent>
                </Card>
            </div>
                {opponentData === "Waiting..." ? (
                    <div className="loading mt-4 flex flex-col items-center justify-center">
                        <div aria-hidden="true" className="spinner border-4 border-t-4 border-white border-opacity-50 rounded-full w-8 h-8 animate-spin"></div>
                        <p aria-label="Waiting for oppononent label" className="mt-2 text-white">Waiting...</p>
                    </div>
                ) : (
                    <Board />
                )}
        </div>
        </div>
    );
};

export default Game;
