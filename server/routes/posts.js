const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
const client = new MongoClient(uri);

router.post('/newpost', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const { title, content } = req.body;
    const author = req.session.userId;
    const timestamp = new Date().toISOString();

    try {
        await client.connect();
        const db = client.db("IN017");
        const posts = db.collection("posts");

        const existingPost = await posts.findOne({ title });
        if (existingPost) { return res.status(400).json({ message: "titre déjà pris" })}

        await posts.insertOne({ title, author, timestamp, content });
        res.status(201).json({ message: "publication réussie" });

    } catch (err) {
        console.error("Registration error:",err);
        res.status(500).json({ message: "Internal server error"});
    }
});

router.get('/all-posts', async(req,res) => {
    try {
        await client.connect();
        const db = client.db("IN017");
        const coll = db.collection("posts").find();
        const posts = await coll.toArray();
    
        res.json(posts);

    } catch (err) {
        console.error("posts not found?",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;