const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

// envoyer une requête d'inscription
router.post('/register', async(req,res) => {
    const { fstname, surname, dob, username, password } = req.body;

    try {
        const db = await getDB();
        const users = db.collection("users")
        const registrations = db.collection("registrations");

        // vérifier si le nom d'utilisateur n'existe pas déjà
        const existingUsername = await users.findOne({ username });
        if (existingUsername) { return res.status(400).json({ message: "username already taken" })}

        // vérifier si l'utilisateur n'existe pas déjà
        const alreadyUser = await users.findOne({ fstname, surname });
        if (alreadyUser) { return res.status(400).json({ message: "already a member" }); }

        // vérifier si une requête d'inscription a déjà été envoyée
        const alreadyRegistered = await registrations.findOne({ fstname, surname });
        if (alreadyRegistered) { return res.status(400).json({ message: "registration already sent" }); }

        await registrations.insertOne({ // envoyer la requête d'inscription
            "fstname": fstname,
            "surname": surname,
            "dob": dob, 
            "username": username, 
            "password": password,
        });
        res.status(201).json({ message: "registration sent" });

    } catch (err) {
        console.error("error registration", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// se connecter
router.post('/login', async(req,res) => {
    const { username, password } = req.body;

    try {
        const db = await getDB();
        const users = db.collection("users");

        const user = await users.findOne({ username });
        if (!user) { return res.status(401).json({ message: "non-existent user" }) };
        if (user.password != password) { return res.status(401).json({ message: "incorrect password" }) };

        req.session.userID = user._id; //stocker userID dans la session

        res.status(201).json({ message: "logged in", userID: user._id });
    } catch (err) {
        console.error("error logging in", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// se deconnecter
router.post('/logout', async(req,res) => {
    req.session.destroy((err) => {
        if (err) { return res.status(500).json({ message: "error logging out" }); }
        res.clearCookie('cookie');
        res.status(200).json({ message: "logged out" });
    });
});

// vérifier que l'utilisateur est bien connecté
router.get('/check-session', async(req,res) => {
    if (req.session.userID) { return res.status(200).json({ message: "logged in" }); }
    else { return res.status(401).json({ message: "not logged in" }); }
});

module.exports = router;
