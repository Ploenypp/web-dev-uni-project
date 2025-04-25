const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");
const { ObjectId } = require('bson'); 

const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
const client = new MongoClient(uri);

router.get('/flagged-posts', async(req,res) => {
    try {
        await client.connect();
        const db = client.db("IN017");
        const posts = db.collection("flagged_posts").find().sort({ 'reports': -1 });
        const flagged = await posts.toArray();
        res.json(flagged);
    } catch(err) {
        console.error("flagged posts not found",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/all-users', async(req,res) => {
    try {
        await client.connect();
        const db = client.db("IN017");
        const all_users = db.collection("users").find().sort({ 'surname': 1 });
        const users = await all_users.toArray();
        res.json(users);
    } catch(err) {
        console.error("users not found",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/registrations', async(req,res) => {
    try {
        await client.connect();
        const db = client.db("IN017");
        const regs = db.collection("registrations").find().sort({ '_id': 1 });
        const registrations = await regs.toArray();
        res.json(registrations);
    } catch(err) {
        console.error("users not found",err);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;