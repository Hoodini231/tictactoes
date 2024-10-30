import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { ServerClient } from "postmark";
import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const databaseString = process.env.REACT_APP_DATABASE_URL;


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Frontend origin
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

const waitingQueue = [];

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
                player1Socket: player1.socket.id,
                player2Socket: player2.socket.id,
                lastMove: null,
                board: Array(9).fill(null)
            };
            const player1Data = {symbol: p1_symbol, myTurn: p1_symbol === 'X', gameState, opponent: player2.username};
            const player2Data = {symbol: p2_symbol, myTurn: p2_symbol === 'X', gameState, opponent: player1.username};

            // Pass opponent data back to the component
            io.to(player1.socket.id).emit("startGame", player1Data);
            io.to(player2.socket.id).emit("startGame", player2Data);
            io.to(roomID).emit("roomIdGenerated", roomID);
            console.log("starting game!!! ", gameState);
            // Notify players they've been paired
            // io.to(roomID).emit("startGame", { roomID });
        }
    });

    socket.on("playerMoved", ({ roomID, gameState }) => {
        console.log("Player moved:", gameState);
        console.log("player emmitting to lobby: ", roomID);

        try {
            io.to(roomID.toString()).emit("playerMoved", { gameState });
            // io.to(socket.id).emit("playerXMoved", { gameState });
            // io.to(gameState.player2Socket).emit("playerXMoved", { gameState });
            // io.to(gameState.player1Socket).emit("playerXMoved", { gameState });
        } catch (error) {
            console.log("Error in playerXMoved:", error);
        }
        
        console.log("emitted completed");
    });

    // socket.on("playerOMoved", ({ roomID, gameState }) => {
    //     console.log("Player O moved:", gameState);
    //     try {
    //         io.to("monkey").emit("playerOMoved", { gameState });
    //         // io.to(socket.id).emit("playerOMoved", { gameState });
    //         // io.to(gameState.player2Socket).emit("playerOMoved", { gameState });
    //         // io.to(gameState.player1Socket).emit("playerOMoved", { gameState });
    //         // io.to(roomID).emit("test", { gameState });
    //     } catch (error) {
    //         console.log("Error in playerOMoved:", error);
    //     }
    //     console.log("emitted completed");
    // });
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});




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
app.post("/play-as-guest", (req, res) => {

});
