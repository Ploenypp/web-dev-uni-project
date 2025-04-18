const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");
const { ObjectId } = require('bson'); 

const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
const client = new MongoClient(uri);

router.post('/newpost', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const { title, content } = req.body;
    const userID = req.session.userId;
    const timestamp = new Date(Date.now());
    console.log(userID);

    try {
        await client.connect();
        const db = client.db("IN017");
        const posts = db.collection("posts");

        const existingPost = await posts.findOne({ title });
        if (existingPost) { return res.status(400).json({ message: "titre déjà pris" })}

        const users = db.collection("users");
        const user = await users.findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json( {message: "user not found", userID }); }
        const author = user.fstname.concat(" ",user.surname);

        await posts.insertOne({ title, author, "userID": new ObjectId(userID), timestamp, content });
        res.status(201).json({ message: "publication réussie" });

    } catch(err) {
        console.error("publication error:",err);
        res.status(500).json({ message: "Internal server error"});
    }
});

router.get('/all-posts', async(req,res) => {
    try {
        await client.connect();
        const db = client.db("IN017");
        const coll = db.collection("posts").find().sort({'_id': -1});
        const posts = await coll.toArray();
    
        res.json(posts);

    } catch(err) {
        console.error("posts not found?",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/newcomment', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const { parentPostID, content } = req.body;
    const userID = req.session.userId;
    const timestamp = new Date(Date.now());
    console.log(userID);

    try {
        await client.connect();
        const db = client.db("IN017");
        const comments = db.collection("comments");

        const users = db.collection("users");
        const user = await users.findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json( {message: "user not found", userID }); }
        const author = user.fstname.concat(" ",user.surname);

        await comments.insertOne({ "parentPostID": new ObjectId(parentPostID), author, "userID": new ObjectId(userID), timestamp, content });
        res.status(201).json({ message: "publication réussie" });

    } catch(err) {
        console.error("publication error:",err);
        res.status(500).json({ message: "Internal server error"});
    }
});

router.get('/comments', async(req,res) => {
    const { parentPostID } = req.query;
    try {
        await client.connect();
        const db = client.db("IN017");
        const comments = await db.collection("comments").find({ 'parentPostID': new ObjectId(parentPostID) }).toArray();

        res.json(comments);
    } catch(err) {
        console.error("comments not found?", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/profile-posts', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }
    const user = req.session.userId;

    try {
        await client.connect();
        const db = client.db("IN017");
        const posts = await db.collection("posts").find({ userID : new ObjectId(user)}).sort({'_id': -1}).toArray();

        res.json(posts || []);
    } catch(err) {
        console.error("user posts not found",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/visit-user-posts', async(req,res) => {
    const userID = req.session.visitID;

    try {
        await client.connect();
        const db = client.db("IN017");
        const posts = await db.collection("posts").find({ userID: new ObjectId(userID) }).sort({ '_id': -1 }).toArray();

        res.json(posts || []);
    } catch(err) {
        console.error("user posts not found", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;