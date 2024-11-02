# Accessible Tic-Tac-Toe Multiplayer Game

Play here ![URL](tictactoes-wqsc.vercel.app)

A fully accessible, real-time multiplayer Tic-Tac-Toe game built with a focus on inclusivity and user-friendly features. Players can host and join custom games, track their stats, and review each turn of completed matches, all while benefiting from intuitive user authentication.
![image](https://github.com/user-attachments/assets/b0796ce1-6d3d-4108-abac-1969ccc37a2f)


---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Accessibility](#accessibility)
- [Installation](#installation)
- [User Guide](#user-guide)
- [Graphic Examples](#graphic-examples)

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) - for dynamic, server-rendered, and client-rendered pages.
- **Backend**: Node.js with [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - enables real-time, bidirectional communication.
- **Database**: [MongoDB](https://www.mongodb.com/) - to manage game data, user accounts, and game history.
- **Deployment**: Leveraged Vercel to host front-end serverless deployment and Render for backend web service deployment.

---

## Features

### 1. **Multiplayer Games**
   - **Play against anyone**: Easily queue up and find a random opponent.
   - **Host Custom Games**: Easily create a new game room and share the code with friends to join.
   - **Join Custom Games**: Join a game using a room code provided by a friend.

### 2. **Real-Time Updates with WebSockets**
   - Instant feedback on game moves using WebSocket connections, enabling a seamless and responsive multiplayer experience.

### 3. **User Authentication**
   - Secure user accounts with signup, login, and logout features.
   - Persistent sessions so users can return and pick up where they left off.
   - Users bcrypt hashing for more secure password handling.

### 4. **Guest Player Availability**
   - Users can play through automatically generated guest accounts.

### 5. **User Dashboard**
   - **Game Statistics**: View stats like total games played, wins, losses, and ties.
   - **Game History**: Review completed games and replay each turn to analyze moves and strategies.
   - **[Future Support]**: Able to view past games and each turn played by whom.

### 6. **Accessibility**
   - Built with accessibility as a priority, following [WCAG 2.1](https://www.w3.org/TR/WCAG21/) Level AA standards for digital accessibility to make the game enjoyable for all users.
   - **High Contrast Colors for visually impaired** Used high contrast colors against each other to increase readability.
   - **Large and clear text for visually impaired** Used larger text and more spacing to increase readability.
   - **Labels for clarity** Added sub-labels for color blind or those who struggle reading.
   - **Aria label support for screen readers for the visually impaired** Added aria-label support for those using screen readers.
   - **Full keyboard navigability for motor impaired** Added full page functionality and navigability via [TAB] and [ENTER]. Highlighted them distinct colors for the visually impaired.

---
## User Guide
1. **Access Splash page**
   Login, Sign up or play as guest!
2. **Multiplayer Access***
   - Playing with random
     Wait for another random opponent to join the queue!
   - Hosting lobby
     Wait for a friend to join with the custom lobby code!
   - Join lobby
     Enter a valid active lobby code to join the host!
3. **Playing the game**
   Alternate turns with the other player! Player X always starts first but the player assignment is randomised!
   Select an empty box to place your symbol in via using [TAB] to select the highlighted box in dark blue or the mouse. Press [ENTER] or click the mouse to finalize the submission.
   See game instructions below the board during the game for refreshers!
4. **Use either the browser back button or the native back button at the top left of the screen**


## Installation
Not recommended as it is already publically hosted.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/accessible-tic-tac-toe.git
   cd accessible-tic-tac-toe
2. **Change Requests and listens to localhost**
   Examples:
   ```bash
   Axios.post("http://localhost:5001/..."
   Io.("http://localhost:5001")
   Cors.( origin: "http://localhost:3000"...
   
4. **Create your own mongoDB account**
   Can't give you my mongoDB key and connection string so you need to create your own mongodb instance
6. **Connect mongoDB connection string to code base in server**
   Once set up a cluster grab the connection String and place it in index.js in /server
7. **Init Client and Server**
   Start both client and servers on local host by following this from project terminal.
   ```bash
   cd client
   npm run dev
   cd ..
   cd server
   npm start
8. **Launch localhost:3000 in browser**
   
## Architecture Diagram
<img width="1312" alt="image" src="https://github.com/user-attachments/assets/2bf1b2fe-8f35-44cc-ad30-de417dd93f30">


## Graphic Examples
![image](https://github.com/user-attachments/assets/1c9cd029-8abe-477a-9a1b-09c1256ae09b)

![image](https://github.com/user-attachments/assets/d7a8d8d2-ae98-4fe0-bd55-f6212a8b351d)

![image](https://github.com/user-attachments/assets/08230a22-afbf-455d-82a7-34d232552efb)



