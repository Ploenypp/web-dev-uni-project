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
        const posts = await db.collection("flagged_posts").find().sort({'reports': -1});
        const flagged = await posts.toArray();
        res.json(flagged);
    } catch(err) {
        console.error("flagged posts not found",err);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;