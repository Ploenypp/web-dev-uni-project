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

router.post('/accept-registration', async(req,res) => {
    const { regID, fstname, surname, dob, username, password, status, team } = req.body;

    try {
        await client.connect();
        const db = client.db("IN017");
        const users = db.collection("users");
        const registrations = db.collection("registrations");

        await users.insertOne( { fstname, surname, dob, username, password, status, team });
        await registrations.deleteOne( {_id : new ObjectId(regID) });

        res.status(201).json({ message: "registration acceptance success" });
    } catch(err) {
        console.error("registration acceptance failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/reject-registration', async(req,res) => {
    const { regID } = req.body;

    try {
        await client.connect();
        const db = client.db("IN017");
        const registrations = db.collection("registrations");

        await registrations.deleteOne({ _id: new ObjectId(regID) });

        res.status(200).json({ message: "registration rejection success" });
    } catch(err) {
        console.error("registration rejection failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/change-status', async(req,res) => {
    const { userID, newStatus } = req.body;

    try {
        await client.connect();
        const db = client.db("IN017");
        const users = db.collection("users");

        users.updateOne(
            { _id: new ObjectId(userID) },
            { $set: { status: newStatus } }
        );

        res.status(200).json({ message: "status change success" });
    } catch(err) {
        console.error("status change failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/assign-team', async(req,res) => {
    const { userID, assignedTeam } = req.body;

    try {
        await client.connect();
        const db = client.db("IN017");
        const users= db.collection("users");

        users.updateOne(
            { _id: new ObjectId(userID) },
            { $set: { team: assignedTeam } }
        );

        res.status(200).json({ message: "team assignment success" });
    } catch(err) {
        console.error("team assignment failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;