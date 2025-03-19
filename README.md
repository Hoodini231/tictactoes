# Accessible Tic-Tac-Toe Multiplayer Game

[Play here](https://tictactoes-wqsc.vercel.app)

Link: https://tictactoes-wqsc.vercel.app

A fully accessible, real-time multiplayer Tic-Tac-Toe game built with a focus on inclusivity and user-friendly features. Players can host and join custom games, and track their stats.

<img width="1109" alt="image" src="https://github.com/user-attachments/assets/f804d33e-933c-4081-b3dd-2f336fd6e18c">




---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Assumptions](#assumptions)
- [Features](#features)
- [Accessibility](#accessibility)
- [Installation](#installation)
- [User Guide](#user-guide)
- [Graphic Examples](#graphic-examples)
- [Contrast Ratios](#contrast-ratio)
- [Known Issues](#known-issues)

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) - for dynamic, server-rendered, and client-rendered pages.
- **Backend**: Node.js with [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - enables real-time, bidirectional communication.
- **Database**: [MongoDB](https://www.mongodb.com/) - to manage game data, user accounts, and game history.
- **Deployment**: Leveraged Vercel to host front-end serverless deployment and Render for backend web service deployment.
- **[NOTE]**: If api calls to render are pending for a long time this is due to the deployment being spundown due to inactivity give it some time and try again after some time after the first call to 'wake it up'
---
## Assumptions 
- Users won't spam squares and produce a long audio queue for indicating which square is in focus.
- Users who rely on keyboard naviability are familiar with it.
- Trivial implmentation of user authentication and sign up where password strength and valid emails are not checked.
- User will not be active on the same account on two instances or more at the same time.
---
## Interpretations 
- Goal: Make a nicely designed and accessible full-stack web application with user auth and profiles
- Achieved: Stores game state and turn moves, user profiles and stats, real-time multiplayer connection, anonymous user creation via guest. Announce the winner when appropriate.
- My interpretation for this project was to build a unique and nicely designed website while being accessible and balancing these two. Of course, if we wanted maximum readability via high contrast we could have used a black-and-white theme but it would also be bland and people who prefer color identification would struggle. Thus, I took up the challenge of making a nice design while maintaining high-contrast colors for those who struggle with reading and would prefer navigating through color versus those who struggle with color and rather navigate with text.

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
     
### 5. **Text-to-speech gameplay for the visually impaired**
   - Users are able to receive audio queues for whose turn it is and what square is currently in focus.
   - (In the future) Users will be able to opt in / out of this and it should also indicate if the square is empty or not.

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
   - **Full keyboard navigability for motor impaired** Added full page functionality and navigability via [TAB] and [ENTER]. Highlighted them as distinct colors for the visually impaired.
   - **Audio Queues** Added audio queues to indicate 
---
## Accessibility
Accessibility was a core priority in the design, with considerations for motor, visual, and auditory impairments. I ensured high-contrast colors for labels and buttons, adhering to WCAG 2.1 AA guidelines for optimal readability. 

For the Tic Tac Toe board, I balanced the colors: white, green, red, and blue to represent the four possible cell states.

I implemented ARIA labels across all components, enabling screen reader users to navigate seamlessly with descriptive cues. 

Keyboard navigation was fully supported, allowing users to access every feature with just the [TAB] and [ENTER] keys (tested on Chrome).

Clear focus indicators, including a bold outline, helped users track their on-screen position easily. Additionally, audio cues were added to announce the user’s current square and turn status, aiding those with visual impairments.

---
## User Guide
1. **Access Splash page**<br>
   Login, Sign up or play as guest!
2. **Multiplayer Access**<br>
   - Playing with random<br>
     Wait for another random opponent to join the queue!
   - Hosting lobby<br>
     Wait for a friend to join with the custom lobby code!
   - Join lobby<br>
     Enter a valid active lobby code to join the host!
3. **Playing the game**<br>
   - Alternate turns with the other player! Player X always starts first but the player assignment is randomised!
   - Select an empty box to place your symbol in via using <Strong>[TAB]</Strong> to select the highlighted box in dark blue or the <Strong>mouse</Strong>. Press <Strong>[ENTER]</Strong> or click the <Strong>mouse</Strong> to finalize the submission.
   - See game instructions below the board during the game for refreshers!
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

## API Examples
<img width="842" alt="image" src="https://github.com/user-attachments/assets/006d552e-4cbc-40c8-a3c4-d65ad2fc40dd">

<img width="824" alt="image" src="https://github.com/user-attachments/assets/af82ec59-f57f-4138-9cec-218694f29e65">



## Graphic Examples
--Home page with animations and white outline to indicate focused/selected button.
<img width="1109" alt="image" src="https://github.com/user-attachments/assets/48feaa8c-c397-4987-9400-7dd8a2469cf5">


--Game page with Red as X, Green as O and blue showing active focus square.
<img width="1114" alt="image" src="https://github.com/user-attachments/assets/a5429725-69af-419d-8ec8-055ea2a77a42">


--Game page scrolled down to show game info card and instructions on play.
<img width="1109" alt="image" src="https://github.com/user-attachments/assets/f8ddb5e2-bbb5-4da0-ba69-8761234d1e1a">


--Dashboard on player stats.
![image](https://github.com/user-attachments/assets/e1d3fa02-e928-4e1c-bffb-6a5a9bcc6a91)

--Join a lobby.
![image](https://github.com/user-attachments/assets/a840da1a-8a5e-4eb0-a26a-42dbbff1254c)

--Hosting a lobby.
![image](https://github.com/user-attachments/assets/08230a22-afbf-455d-82a7-34d232552efb)

--Sign in / Sign up.
<img width="1061" alt="image" src="https://github.com/user-attachments/assets/9cf09fb1-25f6-47e4-b14f-99be46aaf18b">


## Contrast Ratios

<img width="713" alt="Screenshot 2024-11-02 at 22 16 15" src="https://github.com/user-attachments/assets/0a034d16-4168-4528-8fc9-54cd0c402186">
<img width="698" alt="Screenshot 2024-11-02 at 22 21 25" src="https://github.com/user-attachments/assets/1051606f-c36e-4ac5-acfa-fb8ed9db9feb">
<img width="686" alt="Screenshot 2024-11-02 at 22 09 47" src="https://github.com/user-attachments/assets/eec2cb79-25ff-49c4-a87d-6d5097efa462">

<img width="687" alt="Screenshot 2024-11-02 at 22 11 06" src="https://github.com/user-attachments/assets/d6a279b1-5378-4acb-97c8-24ebadb2a1e6">

## Known Issues
- Accessing on mobile devices may cause some form of client-side application error on attempting to activate a cell.

