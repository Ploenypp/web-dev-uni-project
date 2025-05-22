const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson'); 

// récupérer tous les amis de l'utilisateur connecté
router.get('/friends', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;

    try {
        const db = await getDB();
        const friends = await db.collection("friends").find({ $or: [ 
            { friend1ID: new ObjectId(userID) },
            { friend2ID: new ObjectId(userID) }
        ]}).toArray();
        res.status(200).json(friends);
    } catch(err) {
        console.error("error fetching friends", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// envoyer un message 
router.post('/new-message/:chatID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }

    const userID = req.session.userID;
    const chatID = req.params.chatID;
    const { message } = req.body;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();

        const friendship = await db.collection("friends").findOne({ _id: new ObjectId(chatID) }); // récupérer les informations de l'amitié
        const user_name = (userID === friendship.friend1ID.toString() ? friendship.friend1_name : friendship.friend2_name); // récupérer le nom de l'utilisateur

        await db.collection("friends").updateOne( // ajouter le message
            { _id: new ObjectId(chatID) }, 
            {$push: { messages : { 
                authorID: userID, 
                author: user_name, 
                content: message, 
                timestamp: timestamp 
            }}}
        );
        res.status(201).json({ message: "message sent" });
    } catch(err) {
        console.error("error sending message", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// récupérer tous les messages d'une amitié/d'un chat
router.get('/get-messages/:chatID', async(req,res) => {
    const chatID = req.params.chatID;

    try {
        const db = await getDB();
        const friendship = await db.collection("friends").findOne({ _id: new ObjectId(chatID) });
        const messages = friendship.messages;

        res.status(200).json(messages);
    } catch(err) {
        console.error("error fetching messages", err);
        res.status(500).json({ message: "internal server error" });
    }
});

module.exports = router;