const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('bson'); 

const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
const client = new MongoClient(uri);

router.get('/profile', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const userID = req.session.userId;

    try {
        await client.connect();
        const db = client.db("IN017");
        const all_users = db.collection("users");

        const user = await all_users.findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json({ message: "User not found" }); }
        res.json(user);

    } catch (err) {
        console.error("user not found?",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/visit', async(req,res) => {
    const { userID } = req.body;

    try {
        req.session.visitID = userID;
        res.status(200).json({ message: "visitID stored" });
    } catch(err) {
        console.error("store visitID failed", err);
        res.status(500).json({ message: "Internal server error" });
    }

});

router.get('/visit-user', async(req,res) => { 
    if (!req.session.visitID) {
        return res.status(404).json({ message: "visitID not found" });
    }
    const userID = req.session.visitID;

    try {
        await client.connect();
        const db = client.db("IN017");
        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json({ message: "User not found" }); }
        res.json(user);
    } catch(err) {
        console.error("user not found", err);
        res.status(500).json({ message: "Internal server error" });
    }

})

router.get('/friends', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const userID = req.session.userId;

    try {
        await client.connect();
        const db = client.db("IN017");
        const friends = await db.collection("friends").find({ $or: [ 
            { friend1ID: new ObjectId(userID) },
            { friend2ID: new ObjectId(userID) }
        ]}).toArray();
        res.json(friends || []);
    } catch(err) {
        console.error("friends not found :(", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/request-friendship', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const senderID = req.session.userId;
    const { recipientID } = req.body;

    try {
        await client.connect();
        const db = client.db("IN017");
        const friendreqs = db.collection("friend_requests");
        const sender = await db.collection("users").findOne({ _id: new ObjectId(senderID) });

        await friendreqs.insertOne({
            "recipientID": new ObjectId(recipientID),
            "senderID": new ObjectId(senderID),
            "sender_fstname": sender.fstname,
            "sender_surname": sender.surname
        });

        res.status(201).json({ message: "friend request sent" });
    } catch(err) {
        console.error("request error",err);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get('/check-friend-requests', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const userID = req.session.userId;

    try {
        await client.connect();
        const db = client.db("IN017");
        const friendreqs = await db.collection("friend_requests").find({ senderID: new ObjectId(userID) }).toArray();
        res.json(friendreqs || []);
    } catch(err) {
        console.error("friend requests not found", err);
        res.status(500).json({ message: "Internal server error" });
    }

});

router.get('/get-friend-requests', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const userID = req.session.userId;

    try {
        await client.connect();
        const db = client.db("IN017");
        const friendreqs = await db.collection("friend_requests").find({ recipientID: new ObjectId(userID) }).toArray();
        res.json(friendreqs || []);
    } catch(err) {
        console.error("friend requests not found", err);
        res.status(500).json({ message: "Internal server error" });
    }

});

router.post('/accept-friend-request', async(req,res) => {
    if(!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const userID = req.session.userId;
    const friendID = req.body.friendID;

    try {
        await client.connect();
        const db = client.db("IN017");
        const friends = db.collection("friends");
        const friend_reqs = db.collection("friend_requests");

        const all_users = db.collection("users");
        const friend1 = await all_users.findOne({ _id: new ObjectId(userID) });
        const friend2 = await all_users.findOne({ _id: new ObjectId(friendID) });

        await friends.insertOne({
            "friend1": new ObjectId(userID),
            "friend1_name" : friend1.fstname.concat(" ",friend1.surname),
            "friend2": new ObjectId(friendID),
            "friend2_name" : friend2.fstname.concat(" ",friend2.surname)
        });

        await friend_reqs.deleteOne({
            "recipientID" : new ObjectId(userID),
            "senderID": new ObjectId(friendID)
        });

        await friend_reqs.deleteOne({
            "recipientID" : new ObjectId(friendID),
            "senderID": new ObjectId(userID)
        });

        res.status(201).json({ message: "friendship accepted" });
    } catch(err) {
        console.error("acceptance error",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/reject-friend-request', async(req,res) => {
    if(!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const userID = req.session.userId;
    const friendID = req.body.friendID;

    try {
        await client.connect();
        const db = client.db("IN017");
        const friend_reqs = db.collection("friend_requests");

        await friend_reqs.deleteOne({
            "recipientID" : new ObjectId(userID),
            "senderID": new ObjectId(friendID)
        });

        await friend_reqs.deleteOne({
            "recipientID" : new ObjectId(friendID),
            "senderID": new ObjectId(userID)
        });

        res.status(201).json({ message: "friendship rejected" });
    } catch(err) {
        console.error("rejection error",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;