"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { io } from "socket.io-client";
import Board from '../board/page.tsx';

const HostGame = () => {
  const [lobbyCode, setLobbyCode] = useState("Creating...");
  const [title, setTitle] = useState("Host Game");
  const [username, setUsername] = useState("Player 1");
  const [opponent, setOpponent] = useState("Waiting...");
  const [hosted, setHosted] = useState("false");
  const [mySymbol, setMySymbol] = useState("?");

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
    const newSocket = io("https://tictactoes-5foa.onrender.com", { withCredentials: true});
    
    if (typeof window !== "undefined") { // Check if it's running on the client
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
            if (newSocket) {
                console.log("emit");
                newSocket.emit("hostRoom", { username: storedUsername });
                setHosted("true");
            }
        }
    }

    newSocket.on('connect', () => {
        console.log('Connected to server');
    });

    // Join a room on server

    newSocket.on("roomIdGenerated", (data) => {
        setLobbyCode(data);
        sessionStorage.setItem('roomID', data);
    });

    newSocket.on('startGame', (data) => {
        console.log('Starting game:', data);
        setMySymbol(data.symbol);
        setOpponent(data.opponent);
        setTitle("Tic Tac Toes");
    });

    newSocket.on('gameOver', (data) => {
        console.log('Game over:', data);
        setGameState(data); // Update game state with received data
    });

    // Clean up on component unmount
    return () => {
        newSocket.disconnect();
    };
}, [hosted]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex flex-col items-center justify-start p-4">
      <div>
        <h1 aria-label={`${title} title label`} className="text-4xl font-bold text-white mb-8 mt-4">{title}</h1>
        <button 
          aria-label="Back button"
          className="back-button absolute top-4 left-40 px-4 py-2 bg-white text-black font-bold rounded hover:bg-blue-600"
          onClick={() => window.history.back()}
        >
            Back
        </button>
        <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between gap-2 mb-8">
          <Card aria-label="Your information card" className="w-full sm:w-[calc(50%-0.5rem)]">
            <CardHeader>
              <CardTitle>You</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{username}</p>
              {opponent === "Waiting..." ? (
                  <></>
              ) :(
                  <>
                  <p aria-label={`Playing as ${mySymbol} label`} className={`text-lg`}>[Playing as {mySymbol}]</p>
                  <p aria-label={`Playing as color ${mySymbol === "X" ? "Red" : "Green"}`} className={`text-lg text${mySymbol}`}>[Is color {mySymbol === "X" ? "Red" : "Green"}]</p>
                  </>
                  )
              }
            </CardContent>
          </Card>
          
          <Card aria-label="Opponent information card" className="w-full sm:w-[calc(50%-0.5rem)]">
            <CardHeader>
              <CardTitle>Opponent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{opponent}</p>
              { opponent === "Waiting..." ? (
                  <></>
                  ):(
                      <>
                          <p aria-label={`Opponent playing as ${mySymbol === "X" ? "O" : "X"}`} className={`text-lg`}>[Playing as {mySymbol === "X" ? "O" : "X"}]</p>
                          <p aria-label={`Opponent playing as color ${mySymbol === "X" ? "Green" : "Red"}`} className={`text-lg text${mySymbol === "X" ? "O" : "X"}`}>[Is color {mySymbol === "X" ? "Green" : "Red"}]</p>
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
              <CardTitle aria-label="Lobby code title" className="text-center">Lobby Code</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
              <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input 
                  aria-label={`Lobby code ${lobbyCode} label`}
                  type="text" 
                  value={lobbyCode} 
                  readOnly 
                  className="text-center text-2xl font-bold"
                  />
                  <Button aria-label="copy lobby code button" className="hover:bg-blue-900 focus:bg-blue-900 hover:outline hover:outline-2 hover:outline-white focus:outline focus:outline-2 focus:outline-white" size="icon" onClick={copyLobbyCode}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy lobby code</span>
                  </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Share this code with your opponent to join the game</p>
              </CardContent>
          </Card>
          ) : (
              <Board />
          )}
          
        </div>
      </div>
    </div>
  );
};

export default HostGame;