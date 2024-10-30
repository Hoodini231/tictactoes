import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const HostGame = () => {
  const [lobbyCode, setLobbyCode] = useState("ABC123");

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex flex-col items-center justify-start p-4">
      <h1 className="text-4xl font-bold text-white mb-8 mt-4">Host Game!</h1>
      
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <Card className="w-full sm:w-[calc(50%-0.5rem)]">
          <CardHeader>
            <CardTitle>You</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Player 1</p>
            {/* Add more player details here if needed */}
          </CardContent>
        </Card>
        
        <Card className="w-full sm:w-[calc(50%-0.5rem)]">
          <CardHeader>
            <CardTitle>Opponent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Waiting for player...</p>
          </CardContent>
        </Card>
      </div>
      
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
    </div>
  );
};

export default HostGame;