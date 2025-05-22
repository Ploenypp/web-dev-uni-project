const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson'); 

// get user information by userID
router.get('/byUserID/:userID', async(req,res) => {
    const userID = req.params.userID;

    try {
        const db = await getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json({ message: "user not found" }); }
        return res.json(user);
    } catch(err) {
        console.error("user not found :", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// get user information by user's names (fstname_surname)
router.get('/byUserNames/:userNames', async(req,res) => {
    const userNames = req.params.userNames.split('_');

    try {
        const db = await getDB();
        const user = await db.collection("users").findOne({
            fstname : userNames[0],
            surname: userNames[1]
        });
        if (!user) { return res.status(404).json({ message: "user not found" }); }
        return res.json(user);
    } catch(err) {
        console.error("user not found :", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// get current user's userID
router.get('/currentUserID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    return res.json(req.session.userID);
});

// get current user's information
router.get('/currentUser', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    const userID = req.session.userID;

    try {
        const db = await getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json({ message: "user not found" }); }
        return res.json(user);
    } catch (err) {
        console.error("current user not found :",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// get current user's names (fstname_surname) DELETE IF NOT NEEDED
router.get('/currentUserNames', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    const userID = req.session.userID;

    try {
        const db = await getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        const names = `${user.fstname}_${user.surname}`;
        return res.json(names);
    } catch(err) {
        console.error("current user's names not found :",err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.get('/check-request/:userID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    const currentUserID = req.session.userID;
    const userID = req.params.userID;

    try {
        const db = await getDB();
        const request = await db.collection("friend_requests").findOne({
            $or: [
                {senderID: new ObjectId(currentUserID),
                recipientID: new ObjectId(userID)},
                {senderID: new ObjectId(userID),
                recipientID: new ObjectId(currentUserID)}
            ]
        });
        return res.json(request != null);
    } catch(err) {
        console.error("error checking request status :",err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.get('check-friendship/:userID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    const currentUserID = req.session.userID;
    const userID = req.params.userID;

    try {
        const db = await getDB();
        const friendship = await db.collection("friends").findOne({
            $or: [
                { friend1ID: new ObjectId(currentUserID), 
                friend2ID: new ObjectId(userID) },
                
                { friend1ID: new ObjectId(userID),
                friend2ID: new ObjectId(currentUserID) }
            ]
        });
        return res.json(friendship != null); 
    } catch(err) {
        console.error("error checking friendnship status :",err);
        res.status(500).json({ message: "internal server error" });
    }
});

//REWRITE ? DELETE -> messages.js
router.get('/friends', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
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
        console.error("friends not found :(", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//CHECK
router.post('/request-friendship/:recipientID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }

    const senderID = req.session.userID;
    const recipientID = req.params.recipientID;

    try {
        const db = await getDB();
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
        console.error("error requesting friendship",err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get('/get-friend-requests', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    const userID = req.session.userID;

    try {
        const db = await getDB();
        const friendreqs = await db.collection("friend_requests").find({ recipientID: new ObjectId(userID) }).toArray();
        return res.json(friendreqs || []);
    } catch(err) {
        console.error("error fetching friend requests :", err);
        res.status(500).json({ message: "internal server error" });
    }

});

//CHECK
router.post('/accept-friend-request/:senderID', async(req,res) => {
    if(!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const userID = req.session.userID;
    const senderID = req.params.senderID;

    try {
        const db = await getDB();

        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        const sender = await db.collection("users").findOne({ _id: new ObjectId(senderID) });

        await db.collection("friends").insertOne({
            "friend1ID": new ObjectId(userID),
            "friend1_name" : user.fstname.concat(" ",user.surname),
            "friend2ID": new ObjectId(senderID),
            "friend2_name" : sender.fstname.concat(" ",sender.surname),
            "messages": []
        });

        await db.collection("friend_requests").deleteOne({
            $or: [
                {"recipientID" : new ObjectId(userID),
                "senderID": new ObjectId(senderID) },

                {"recipientID" : new ObjectId(senderID),
                "senderID": new ObjectId(userID)}
            ]
        });

        res.status(201).json({ message: "friendship accepted" });
    } catch(err) {
        console.error("error accepting friendship request",err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.delete('/reject-friend-request/:requestID', async(req,res) => {
    const requestID = req.params.requestID;

    try {
        const db = await getDB();

        await db.collection("friend_requests").deleteOne({ _id: new ObjectId(requestID) });

        res.status(201).json({ message: "friendship rejected" });
    } catch(err) {
        console.error("error rejecting friendship request",err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get('/get-notifications/', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }
    const userID = req.session.userID;

    try { 
        const db = await getDB();
        const notifs = await db.collection("notifications").find({ recipientID: new ObjectId(userID) }).toArray();

        return res.json(notifs || []);
    } catch(err) {
        console.error("notification retrieval error",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete('/delete-notification/:notifID', async(req,res) => {
    const notifID = req.params.notifID;

    try {
        const db = await getDB();
        await db.collection("notifications").deleteOne({ _id: new ObjectId(notifID) });

        res.status(200).json({ message: "delete notification success" });
    } catch(err) {
        console.error("notification deletion error",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;