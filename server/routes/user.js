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
        if (!user) { return res.status(404).json({ message: "User not found"}); }
        res.json(user);

    } catch (err) {
        console.error("user not found?",err);
        res.status(500).json({ message: "Internal server error"});
    }
})

module.exports = router;