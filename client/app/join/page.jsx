import React, { useState } from 'react';

const JoinGamePage = () => {
  const [gameCode, setGameCode] = useState('');

  const handleInputChange = (event) => {
    setGameCode(event.target.value);
  };

  const handleJoinGame = () => {
    if (gameCode) {
      // Logic to join the game goes here
      console.log(`Joining game with code: ${gameCode}`);
      // Add your join game logic (API call or state update) here
    } else {
      alert('Please enter a valid game code');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Join a Game</h1>
      <input
        type="text"
        value={gameCode}
        onChange={handleInputChange}
        placeholder="Enter Game Code"
        style={{ padding: '10px', fontSize: '16px', width: '300px' }}
      />
      <br />
      <button
        onClick={handleJoinGame}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Join Game
      </button>
    </div>
  );
};

export default JoinGamePage;
