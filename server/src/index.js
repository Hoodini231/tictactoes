import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import User from "./models/user.js";
import Game from "./models/games.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";


dotenv.config();

const databaseString = process.env.REACT_APP_DATABASE_URL;


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3000", // Frontend origin
        origin: "https://tictactoes-wqsc.vercel.app", // Frontend origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

mongoose.connect(databaseString)
    .then(() => {
        console.log("Connected to MongoDB");
        server.listen(5001, () => {
            console.log('Server is running on port 5001');
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB", error);
    });

//const serverClient = new postmark.ServerClient("POSTMARK_SERVER_API_TOKEN");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 10000
}));

app.use(bodyParser.json({
    limit: '50mb',
    parameterLimit: 10000
}))

let waitingQueue = [];
let rooms = new Map();
let tempGameStates = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.emit("connected", { message: "You are connected!" });

    socket.on("joinQueue", ({ username }) => {
        waitingQueue.push({ socket, username });
        console.log("User joined queue:", username);
        console.log("Queue length:", waitingQueue.length);
        if (waitingQueue.length >= 2) {
            const player1 = waitingQueue.shift();
            const player2 = waitingQueue.shift();
            const roomID = uuidv4().substring(0, 10);
            // Assign both players to the same room
            player1.socket.join(roomID);
            player2.socket.join(roomID);
            player1.socket.roomID = roomID;
            player2.socket.roomID = roomID;
            player1.socket.username = player1.username;
            player2.socket.username = player2.username;
            let p1_symbol = 'X';
            let p2_symbol = 'O';
            if (Math.random() < 0.5) {
                p1_symbol = 'O';
                p2_symbol = 'X';
            }
            const gameState = {
                playerX: p1_symbol === 'X' 
                    ? player1.username 
                    : player2.username, 
                playerO: p1_symbol === 'O' 
                    ? player1.username 
                    : player2.username, 
                roomID: roomID,
                lastTurn: null,
                board: Array(9).fill(null),
                winner: null,
                status: 'progress',
                turnNumber: 0
            };
            const player1Data = {symbol: p1_symbol, myTurn: p1_symbol === 'X', gameState: gameState, opponent: player2.username};
            const player2Data = {symbol: p2_symbol, myTurn: p2_symbol === 'X', gameState: gameState, opponent: player1.username};

            // Pass opponent data back to the component
            io.to(player1.socket.id).emit("startGame", player1Data);
            io.to(player2.socket.id).emit("startGame", player2Data);
            tempGameStates.set(roomID, gameState);
            console.log(tempGameStates);
            io.to(roomID).emit("roomIdGenerated", roomID);
            console.log("starting game!!! ", gameState);
        }
    });

    socket.on("playerMoved", ({ roomID, gameState }) => {
        try {
            io.to(roomID.toString()).emit("playerMoved", { gameState });
            uploadGameState(gameState);
        } catch (error) {
            console.log("Error in playerXMoved:", error);
        }
    });

    socket.on("playerWon", ({ roomID, gameState }) => {
        try {
            console.log("plaeyr won");
            io.to(roomID.toString()).emit("playerWon", { gameState });
            uploadGameState(gameState);
            updateUserData(gameState);
        } catch (error) {
            console.log("Error in playerWon:", error);
        }
    });

    socket.on("hostRoom", ({username}) => {
        const roomID = uuidv4().substring(0, 10);
        socket.roomID = roomID;
        socket.username = username;
        socket.join(roomID);
        rooms.set(roomID, { host: username, hostSocket: socket.id });
        //io.to(socket.id).emit("roomIdGenerated", roomID);
        console.log("emitting back to host ", roomID);
        io.to(roomID).emit("roomIdGenerated", roomID);
    });

    socket.on("joinRoom", ({roomID, username}) => {
        console.log("attempted join");
        console.log("join roomdID: " + roomID);
        console.log("join rooms.get: ", io.sockets.adapter.rooms.get(roomID));
        io.to(roomID).emit("roomJoined", { message: "sup" });
        const room = io.sockets.adapter.rooms.get(roomID);
        if (room && room.size === 1) {
            io.to(socket.id).emit("roomJoined", { message: "Room joined " + roomID });
            const existingPlayer = Array.from(room)[0];
            socket.join(roomID);
            socket.username = socket.id; // Assuming socket.id is used as username
            const hostUsername = rooms.get(roomID).host;
            const hostSocket = rooms.get(roomID).hostSocket;
            let p1_symbol = 'X';
            let p2_symbol = 'O';
            if (Math.random() < 0.5) {
                p1_symbol = 'O';
                p2_symbol = 'X';
            }

            const gameState = {
                playerX: p1_symbol === 'X' ? hostUsername : username,
                playerO: p1_symbol === 'O' ? hostUsername : username,
                roomID: roomID,
                lastTurn: null,
                board: Array(9).fill(null),
                winner: null,
                status: 'progress',
                turnNumber: 0
            };

            const player1Data = {
                symbol: p1_symbol,
                myTurn: p1_symbol === 'X',
                gameState: gameState,
                opponent: username
            };
            const player2Data = {
                symbol: p2_symbol,
                myTurn: p2_symbol === 'X',
                gameState: gameState,
                opponent: hostUsername
            };
            tempGameStates.set(roomID, gameState);
            io.to(hostSocket).emit("startGame", player1Data);
            io.to(socket.id).emit("startGame", player2Data);
        } else {
            io.to(socket.id).emit("roomFull", { message: "Room is full" });
        }
    });

    socket.on("boardSocketJoin", (roomID) => {
        console.log("board socket joined");
        socket.join(roomID);
        const gameState = tempGameStates.get(roomID);
        console.log(gameState);
        io.to(socket.id).emit("boardSocketJoinedSuccessful", {gameState: gameState});
    })

    socket.on("disconnect", () => {
        console.log("dced ", socket.id);
        if (!socket.roomID) {
            waitingQueue = waitingQueue.filter((player) => player.socket.id !== socket.id);
        }
    });
});

async function uploadGameState(gameState) {
    try {
        const finalGameState = new Game({
            winner: gameState.winner !== null ? gameState.winner : "none", // Ensure winner is set
            gameID: gameState.roomID, // Corrected from gameID to gameId
            playerX: gameState.playerX,
            playerO: gameState.playerO,
            lastUpdate: new Date(),
            board: gameState.board,
            lastTurn: gameState.lastTurn || "none", // Ensure lastTurn is set
            status: gameState.status || "incomplete",
            turnNumber: gameState.turnNumber || 0
        });
        await finalGameState.save();
        console.log("saved");
        console.log(finalGameState);
    } catch (error) {
        console.log('Err uploading', error);
    }
}



// ==================================
// Functions for user authentication
// ==================================


app.post("/signup", async (req, res) => {
    try {
        console.log("arrived at signup");
        const { username, email, password } = req.body;
        console.log(req.body);
        const userId = uuidv4(); // Great random user id gererator
        const hashPswd = await bcrypt.hash(password, 10);
        //const token = serverClient.createToken(userId);
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            res.status(400).json({ error: "Username or email already exists" });
            return;
        }
        const newUser = new User({
            userId: userId,
            username: username,
            email: email,
            password: hashPswd
        });

        await newUser.save();
        res.json({ userId, username, email, hashPswd });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("test", async (req, res) => {
    try {
        console.log("arrived at test");
        res.json({ message: "test" });
    } catch (error) {
        res.json(error);
    }
});

/**
 * Call for user to login to their acount
 */
app.post("/login", async (req, res) => {
    try {
        console.log("arrived at login");
        const { username, password } = req.body;
        console.log(req.body);
        const user = await User.findOne({ username });
        console.log(user);
        if (!user) {
            res.status(400).json({ error: "Invalid username or password" });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(400).json({ error: "Invalid username or password" });
            return;
        }
        
        res.json({ 
            message: "Login successful", 
            username: user.username,
            email: user.email,
            userId: user.userId,
            password: user.password,
            
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Create a new temporary user account for the guest with random username
 * Then delete account after some time.
 */
app.post("/play-as-guest", async (req, res) => {
    try {
        const anonUser = new User({
            username: `guest-${uuidv4().substring(0, 9)}`,
            email: `guest-${uuidv4().substring(0, 9)}@fake.com`,
            password: await bcrypt.hash(uuidv4(), 10),
            userId: uuidv4()
        });
        await anonUser.save();
        res.json({ username: anonUser.username, password: anonUser.password});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// works
app.get("/findUser", async (req, res) => {
    try {
        const username = req.query.username;
        const user = await User.find({ username });
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/fetchUserGames", async (req, res) => {
    try {
        const username = req.query.username;
        
        // Fetch games where the user was either playerX or playerO
        const games = await Game.find({ $or: [{ playerX: username }, { playerO: username }] });
        const completedGames = games.filter(game => game.status === 'complete');
        // Group games by gameID, keeping only the one with the highest turnNumber for each gameID
        const uniqueGames = completedGames.reduce((acc, game) => {
            if (
                !acc[game.gameID] || 
                (acc[game.gameID] && game.turnNumber > acc[game.gameID].turnNumber)
            ) {
                acc[game.gameID] = game;
            }
            return acc;
        }, {});

        // Extract the games from the grouped object and return as an array
        const result = Object.values(uniqueGames);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/fetchGameData", async (req, res) => {
    try {
        const gameID = req.query.gameID; 
        console.log(gameID);
        const gameData = await Game.find({ gameID }).sort({ turnNumber: -1 }); 
        res.json(gameData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function updateUserData(gameState) {
    try {
        const playerX = await User.findOne({ username: gameState.playerX });
        const playerO = await User.findOne({ username: gameState.playerO });
        if (gameState.winner === 'X') {
            playerX.stats.wins += 1;
            playerO.stats.losses += 1;
        } else if (gameState.winner === 'O') {
            playerO.stats.wins += 1;
            playerX.stats.losses += 1;
        } else {
            playerX.stats.ties += 1;
            playerO.stats.ties += 1;
        }
        playerX.stats.gamesPlayed += 1;
        playerO.stats.gamesPlayed += 1;
        await playerX.save();
        await playerO.save();
    } catch (error) {
        console.log("Error in updateUserData:", error);
    }
}

