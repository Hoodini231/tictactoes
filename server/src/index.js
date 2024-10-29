import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { ServerClient } from "postmark";
import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";

dotenv.config();

const databaseString = process.env.REACT_APP_DATABASE_URL;

mongoose.connect(databaseString)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(5001, () => {
            console.log('Server is running on port 5001');
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB", error);
    });

const app = express();
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

// ==================================
// Functions for user authentication
// ==================================


app.post("/signup", async (req, res) => {
    try {
        console.log("arrived at signup");
        const { username, email, pswd } = req.body;
        console.log(req.body);
        const userId = uuidv4(); // Great random user id gererator
        const hashPswd = await bcrypt.hash(pswd, 10);
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
