# Accessible Tic-Tac-Toe Multiplayer Game

Play here ![URL](tictactoes-wqsc.vercel.app)

A fully accessible, real-time multiplayer Tic-Tac-Toe game built with a focus on inclusivity and user-friendly features. Players can host and join custom games, track their stats, and review each turn of completed matches, all while benefiting from intuitive user authentication.
![image](https://github.com/user-attachments/assets/b0796ce1-6d3d-4108-abac-1969ccc37a2f)


---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Graphic Examples](#graphic-examples)

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) - for dynamic, server-rendered, and client-rendered pages.
- **Backend**: Node.js with [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - enables real-time, bidirectional communication.
- **Database**: [MongoDB](https://www.mongodb.com/) - to manage game data, user accounts, and game history.
- **Deployment**: Vercel and Render are used for the easy deployment of my client and server-side files.

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

### 6. **Accessibility**
   - Built with accessibility as a priority, following [WCAG 2.1](https://www.w3.org/TR/WCAG21/) Level AA standards for digital accessibility to make the game enjoyable for all users.
   - **High Contrast Colors for visually impaired** Used high contrast colors against each other to increase readability.
   - **Large and clear text for visually impaired** Used larger text and more spacing to increase readability.
   - **Labels for clarity** Added sub-labels for color blind or those who struggle reading.
   - **Aria label support for screen readers for visually impaired** Added aria-label support for those using screen readers.
   - **Full keyboard navigability for motor impaired** Added full page functionality and navigability via [TAB] and [ENTER]. Highlighted them distinct colors for the visually impaired.

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/accessible-tic-tac-toe.git
   cd accessible-tic-tac-toe
## Graphic Examples
![image](https://github.com/user-attachments/assets/1c9cd029-8abe-477a-9a1b-09c1256ae09b)

![image](https://github.com/user-attachments/assets/d7a8d8d2-ae98-4fe0-bd55-f6212a8b351d)

![image](https://github.com/user-attachments/assets/08230a22-afbf-455d-82a7-34d232552efb)



