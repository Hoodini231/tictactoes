# Accessible Tic-Tac-Toe Multiplayer Game

A fully accessible, real-time multiplayer Tic-Tac-Toe game built with a focus on inclusivity and user-friendly features. Players can host and join custom games, track their stats, and review each turn of completed matches, all while benefiting from intuitive user authentication.
![image](https://github.com/user-attachments/assets/b0796ce1-6d3d-4108-abac-1969ccc37a2f)


---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) - for dynamic, server-rendered, and client-rendered pages.
- **Backend**: Node.js with [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - enables real-time, bidirectional communication.
- **Database**: [MongoDB](https://www.mongodb.com/) - to manage game data, user accounts, and game history.

---

## Features

### 1. **Multiplayer Games**
   - **Host Custom Games**: Easily create a new game room and share the code with friends to join.
   - **Join Custom Games**: Join a game using a room code provided by a friend.

### 2. **Real-Time Updates with WebSockets**
   - Instant feedback on game moves using WebSocket connections, enabling a seamless and responsive multiplayer experience.

### 3. **User Authentication**
   - Secure user accounts with signup, login, and logout features.
   - Persistent sessions so users can return and pick up where they left off.

### 4. **User Dashboard**
   - **Game Statistics**: View stats like total games played, wins, losses, and ties.
   - **Game History**: Review completed games and replay each turn to analyze moves and strategies.

### 5. **Accessibility**
   - Built with accessibility as a priority, following [WCAG 2.1](https://www.w3.org/TR/WCAG21/) Level AA standards for digital accessibility to make the game enjoyable for all users.

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/accessible-tic-tac-toe.git
   cd accessible-tic-tac-toe
