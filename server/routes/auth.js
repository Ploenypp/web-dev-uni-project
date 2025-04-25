const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
const client =  new MongoClient(uri);

router.get('/test-session', (req, res) => {
    if (req.session.userId) {
        console.log("User session:", req.session);
        res.status(200).json({ message: "Session is active", userId: req.session.userId });
    } else {
        console.log("No session found");
        res.status(401).json({ message: "No active session" });
    }
});

router.post('/register', async (req,res) => {
    const { fstname, surname, dob, username, password } = req.body;

    try {
        await client.connect();
        const db = client.db("IN017");
        const users = db.collection("users")
        const registrations = db.collection("registrations");

        const existingUsername = await users.findOne({ username });
        if (existingUsername) { return res.status(400).json({ message: "nom d'utilisateur déjà pris" })}

        const alreadyUser = await users.findOne({ fstname, surname });
        if (alreadyUser) { return res.status(400).json({ message: "déjà un membre" }); }

        const alreadyRegistered = await registrations.findOne({ fstname, surname });
        if (alreadyRegistered) { return res.status(400).json({ message: "inscription déjà envoyé" }); }

        await registrations.insertOne({ 
            "fstname": fstname,
            "surname": surname,
            "dob": dob, 
            "username": username, 
            "password": password,
        });
        res.status(200).json({ message: "registration sent" });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/login', async (req,res) => {
    const { username, password } = req.body;

    try {
        await client.connect();
        const db = client.db("IN017");
        const users = db.collection("users");

        const user = await users.findOne({ username });
        if (!user) { return res.status(401).json({ message: "Cette utilisateur n'existe pas" }) };
        if (user.password != password) { return res.status(401).json({ message: "Password incorrect" }) };

        req.session.userId = user._id;
        console.log("User session: ", req.session);

        res.status(201).json({ message: "Connexion réussie", userID: user._id });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/logout', async (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Error logging out" });
        }
        res.clearCookie('cookie');
        res.status(200).json({ message: "Deconnexion réussie" });
    });
});

module.exports = router;
