const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
//const { MongoClient } = require("mongodb");
const { ObjectId } = require('bson'); 

//const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
//const client = new MongoClient(uri);

router.post('/new-message', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const { chatID, content } = req.body;
    const userID = req.session.userID;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();

        const friendship = await db.collection("friends").findOne({ _id: new ObjectId(chatID) });
        const user_name = (userID === friendship.friend1ID.toString() ? friendship.friend1_name : friendship.friend2_name);

        await db.collection("friends").updateOne({ _id: new ObjectId(chatID) }, {$push: { messages : { 
            authorID: userID, 
            author: user_name, 
            content: content, 
            timestamp: timestamp 
        }}})

        res.status(200).json({ message: "message sent" });
    } catch(err) {
        console.error("messages not sent", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/get-messages', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const { chatID } = req.query;

    try {
        const db = await getDB();
        const friendship = await db.collection("friends").findOne({ _id: new ObjectId(chatID) });
        const messages = friendship.messages || [] ;

        res.json(messages);
    } catch(err) {
        console.error("messages not found", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;