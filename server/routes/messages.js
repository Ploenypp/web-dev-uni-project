const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson'); 

router.get('/friends', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }

    const userID = req.session.userID;

    try {
        const db = await getDB();
        const friends = await db.collection("friends").find({ $or: [ 
            { friend1ID: new ObjectId(userID) },
            { friend2ID: new ObjectId(userID) }
        ]}).toArray();
        res.json(friends || []);
    } catch(err) {
        console.error("error fetching friends", err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.post('/new-message/:chatID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const userID = req.session.userID;
    const chatID = req.params.chatID;
    const { message } = req.body;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();

        const friendship = await db.collection("friends").findOne({ _id: new ObjectId(chatID) });
        const user_name = (userID === friendship.friend1ID.toString() ? friendship.friend1_name : friendship.friend2_name);

        await db.collection("friends").updateOne({ _id: new ObjectId(chatID) }, {$push: { messages : { 
            authorID: userID, 
            author: user_name, 
            content: message, 
            timestamp: timestamp 
        }}})

        res.status(200).json({ message: "message sent" });
    } catch(err) {
        console.error("error sending message :", err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get('/get-messages/:chatID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const chatID = req.params.chatID;

    try {
        const db = await getDB();
        const friendship = await db.collection("friends").findOne({ _id: new ObjectId(chatID) });
        const messages = friendship.messages;

        res.json(messages || []);
    } catch(err) {
        console.error("messages not found", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;