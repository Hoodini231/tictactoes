"use client";
import React, { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { io } from "socket.io-client";
import Board from '../board/page';

const HostGame = () => {
    const [lobbyCode, setLobbyCode] = useState("");
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState("Player 1");
    const [opponent, setOpponent] = useState("Waiting...");
    const [joinedGame, setJoinedGame] = useState("false");
    const [mySymbol, setMySymbol] = useState("?");
    const [myTurn, setMyTurn] = useState("false");
    const [gameState, setGameState] = useState({playerX: null, playerY: null, roomId: null, lastMove: null, board: Array(9).fill(null)});


  const copyLobbyCode = () => {
    navigator.clipboard.writeText(lobbyCode)
      .then(() => {
        // You could add a toast notification here
        console.log('Lobby code copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy lobby code: ', err);
      });
    };

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io("http://localhost:5001", { withCredentials: true});
    setSocket(newSocket);
    

    if (typeof window !== "undefined") { // Check if it's running on the client
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
            // if (hosted === "false") {
            //     newSocket.emit("hostRoom", { username: storedUsername });
            //     setHosted("true");
            // }
            //newSocket.emit("hostRoom", { username: storedUsername });
            //newSocket.emit("joinQueue", { roomID: lobbyCode, username: storedUsername });
            
        }
    }

    newSocket.on('connect', () => {
        console.log('Connected to server');
    });

    // Join a room on server
    //newSocket.emit("joinQueue", { roomID: roomID, username: username });

    newSocket.on("roomIdGenerated", (data) => {
        setLobbyCode(data);
    });

    newSocket.on('startGame', (data) => {
        console.log('Starting game:', data);
        setJoinedGame("true");
        setGameState(data.gameState);
        setMySymbol(data.symbol);
        setMyTurn(data.myTurn);
        setOpponent(data.opponent);
        //setGameState(data); // Update game state with received data
    });


    newSocket.on('gameOver', (data) => {
        console.log('Game over:', data);
        setGameState(data); // Update game state with received data
    });

    newSocket.on('roomJoined', (data) => {
        console.log('Room joined:', data);
    });


    // Clean up on component unmount
    return () => {
        newSocket.disconnect();
    };
    }, []);

    const joinLobby = () => {
        console.log(socket);
        console.log(lobbyCode);
        if (socket && lobbyCode) {

            console.log("join");
            socket.emit("joinRoom", { roomID: lobbyCode, username: username });
        }
    };

    // Call the joinLobby function when the Join button is clicked
    <Button size="icon" onClick={joinLobby}>
        Join
    </Button>

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-purple-600 flex flex-col items-center justify-start p-4">
      <div>

        {joinedGame !== 'false' ? (
            <div>
                <h1 className="text-4xl font-bold text-white mb-8 mt-4">Tic tack Toes</h1>
                <button 
                className="back-button absolute top-4 left-40 px-4 py-2 bg-white text-black font-bold rounded hover:bg-blue-600"
                onClick={() => window.history.back()}
                >
                    Back
                </button>
                <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between gap-4 mb-8">
                    <Card className="w-full sm:w-[calc(50%-0.5rem)]">
                    <CardHeader>
                        <CardTitle>You</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{username}</p>
                        {opponent === "Waiting..." ? (
                            <></>
                        ) :(
                            <>
                            <p className={`text-lg`}>[Playing as {mySymbol}]</p>
                            <p className={`text-lg text${mySymbol}`}>[Is color {mySymbol === "X" ? "Red" : "Green"}]</p>
                            </>
                            )
                        }
                    </CardContent>
                    </Card>
                    
                    <Card className="w-full sm:w-[calc(50%-0.5rem)]">
                    <CardHeader>
                        <CardTitle>Opponent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{opponent}</p>
                        { opponent === "Waiting..." ? (
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
                <div>
                {opponent === "Waiting..." ? (
                    <Card className="w-full max-w-md">
                        <CardHeader>
                        <CardTitle className="text-center">Lobby Code</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input 
                            type="text" 
                            value={lobbyCode} 
                            readOnly 
                            className="text-center text-2xl font-bold"
                            />
                            <Button size="icon" onClick={copyLobbyCode}>
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy lobby code</span>
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">Share this code with your opponent to join the game</p>
                        </CardContent>
                    </Card>
                    ) : (
                        <Board socket={socket} roomID={lobbyCode} gameStateInput = {gameState} />
                    )}
                </div>
            </div>
        ) : (
            
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold text-white mb-8 mt-4">Tic tack Toes</h1>
                <button 
                className="back-button absolute top-4 left-40 px-4 py-2 bg-white text-black font-bold rounded hover:bg-blue-600"
                onClick={() => window.history.back()}
            >
                Back
            </button>
                <Card>
                    <CardHeader>
                    <CardTitle className="text-center">Join Lobby</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                        type="text"
                        placeholder="Enter Lobby Code"
                        value={lobbyCode}
                        onChange={(e) => setLobbyCode(e.target.value)}
                        className="text-center text-2xl font-bold border border-gray-600"
                        />
                        <Button className="hover:bg-blue-900 focus:bg-blue-900 hover:outline hover:outline-2 hover:outline-white focus:outline focus:outline-2 focus:outline-white" size="icon" onClick={joinLobby}>
                            Join
                        </Button>       
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">Enter the lobby code to join the game</p>
                    </CardContent>
                </Card>
                </div>
        )
        }
    </div>
    </div>
  );
};

export default HostGame;