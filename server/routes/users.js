const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson'); 

// récupérer les informations d'un utilisateur par leur userID
router.get('/byUserID/:userID', async(req,res) => {
    const userID = req.params.userID;
    try {
        const db = await getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json({ message: "user not found" }); }
        return res.status(200).json(user);
    } catch(err) {
        console.error("error fetching user information", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// récupérer les informations d'un utilisateur par leur noms (fstname_surname)
router.get('/byUserNames/:userNames', async(req,res) => {
    const userNames = req.params.userNames.split('_');
    try {
        const db = await getDB();
        const user = await db.collection("users").findOne({
            fstname : userNames[0],
            surname: userNames[1]
        });
        if (!user) { return res.status(404).json({ message: "user not found" }); }
        return res.status(200).json(user);
    } catch(err) {
        console.error("error fetching user information", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// récupérer l'userID de l'utilisateur connecté
router.get('/currentUserID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    return res.status(200).json(req.session.userID);
});

// récupérer les information de l'utilisateur connecté
router.get('/currentUser', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;

    try {
        const db = await getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json({ message: "user not found" }); }
        return res.status(200).json(user);
    } catch (err) {
        console.error("error fetching current user's information",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// récupérer les noms de l'utilisateur connecté (fstname_surname) DELETE IF NOT NEEDED
router.get('/currentUserNames', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;

    try {
        const db = await getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        const names = `${user.fstname}_${user.surname}`;
        return res.status(200).json(names);
    } catch(err) {
        console.error("error fetching current user's names",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// vérifier si une requête d'amitié a été envoyé par/à l'utilisateur connecté
router.get('/check-request/:userID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
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
        return res.status(200).json(request != null);
    } catch(err) {
        console.error("error checking request status",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// vérifier si l'utilisateur connecté et l'utilisateur en question sont déjà amis
router.get('/check-friendship/:userID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
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
        return res.status(200).json(friendship != null); 
    } catch(err) {
        console.error("error checking friendship status",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// envoyer une requête d'amitié
router.post('/request-friendship/:recipientID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const senderID = req.session.userID;
    const recipientID = req.params.recipientID;

    try {
        const db = await getDB();
        const friendreqs = db.collection("friend_requests");
        const sender = await db.collection("users").findOne({ _id: new ObjectId(senderID) }); // récupérer les information de l'utilisateur connecté

        await friendreqs.insertOne({ // envoyer la requête 
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

// récuperer toutes les requêtes d'amitié envoyées à l'utilisateur connecté
router.get('/get-friend-requests', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;

    try {
        const db = await getDB();
        const friendreqs = await db.collection("friend_requests").find({ recipientID: new ObjectId(userID) }).toArray();
        return res.status(200).json(friendreqs);
    } catch(err) {
        console.error("error fetching friend requests", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// accepter une requête d'amitié
router.post('/accept-friend-request/:requestID', async(req,res) => {
    const requestID = req.params.requestID;
    try {
        const db = await getDB();
        const req = await db.collection("friend_requests").findOne({ _id: new ObjectId(requestID) }); // récupérer les information de la requête
    
        const sender = await db.collection("users").findOne({ _id: new ObjectId(req.senderID) }); // récupérer les informations de l'expéditeur
        const recipient = await db.collection("users").findOne({ _id: new ObjectId(req.recipientID) }); // récupérer les informations du destinataire
        await db.collection("friends").insertOne({
            "friend1ID": new ObjectId(recipient._id),
            "friend1_name" : `${recipient.fstname} ${recipient.surname}`,
            "friend2ID": new ObjectId(sender._id),
            "friend2_name" : `${sender.fstname} ${sender.surname}`,
            "messages": []
        });
        await db.collection("friend_requests").deleteOne({ _id: new ObjectId(requestID) }); // supprimer la requête

        res.status(201).json({ message: "friendship accepted" });
    } catch(err) {
        console.error("error accepting friendship request",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// rejeter une requête d'amitié
router.delete('/reject-friend-request/:requestID', async(req,res) => {
    const requestID = req.params.requestID;
    try {
        const db = await getDB();
        await db.collection("friend_requests").deleteOne({ _id: new ObjectId(requestID) });
        res.status(200).json({ message: "friendship rejected" });
    } catch(err) {
        console.error("error rejecting friendship request",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// récupérer les notifications de l'utilisateur connecté
router.get('/get-notifications/', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;

    try { 
        const db = await getDB();
        const notifs = await db.collection("notifications").find({ recipientID: new ObjectId(userID) }).toArray();
        return res.status(200).json(notifs);
    } catch(err) {
        console.error("error fetching notifications",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// supprimer une notification
router.delete('/delete-notification/:notifID', async(req,res) => {
    const notifID = req.params.notifID;
    try {
        const db = await getDB();
        await db.collection("notifications").deleteOne({ _id: new ObjectId(notifID) });
        res.status(200).json({ message: "notification deleted" });
    } catch(err) {
        console.error("error deleting notification",err);
        res.status(500).json({ message: "internal server error" });
    }
});

module.exports = router;