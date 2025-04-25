const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");
const { ObjectId } = require('bson'); 

const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
const client = new MongoClient(uri);

router.get('/all-users', async(req,res) => {
    const prompt = req.query.prompt;
    try {
        await client.connect();
        const db = client.db("IN017");
        await db.collection("users").createIndex({
            fstname: "text",
            surname: "text",
            status: "text",
            team: "text"
        });
        const users = db.collection("users");
        const results = await users.find({
            $text: { $search: prompt }
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.json(results);
    } catch(err) {
        console.error("searching users failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/all-posts', async(req,res) => {
    const prompt = req.query.prompt;
    try {
        await client.connect();
        const db = client.db("IN017");
        await db.collection("posts").createIndex({
            title: "text",
            content: "text",
            author: "text"
        });
        const posts = db.collection("posts");
        const results = await posts.find({
            $text: { $search: prompt }
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.json(results);
    } catch(err) {
        console.error("searching posts failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;