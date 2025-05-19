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
        const posts = db.collection("admin_posts");

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

router.get('/posts', async(req,res) => {
    try {
        await client.connect();
        const db = client.db("IN017");
        const coll = db.collection("admin_posts").find().sort({'_id': -1});
        const posts = await coll.toArray();
    
        res.json(posts);

    } catch(err) {
        console.error("posts not found?",err);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post('/delete-post', async(req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }

    const { postID } = req.body;

    try {
        await client.connect();
        const db = client.db("IN017");
        const posts = db.collection("admin_posts");
        const comments = db.collection("comments");
        {/*const flagged = db.collection("flagged_posts");*/}

        await posts.deleteOne({ _id: new ObjectId(postID) });
        {/*await comments.deleteMany({ parentPostID: new ObjectId(postID) });
        await flagged.deleteOne({ _id: new ObjectId(postID) });*/}

        res.status(200).json({ message: "suppression réussie" });
    } catch(err) {
        console.error("deletion error:",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete('/delete-user/:id', async(req,res) => {
    const userID = req.params.id;

    try {
        await client.connect();
        const db = client.db("IN017");

        await db.collection("posts").updateMany(
            { userID: new ObjectId(userID) },
            { $set: {
                userID: null, 
                author: "utilisateur supprimé" 
            }}
        );
        console.log("post modif success");

        await db.collection("admin_posts").updateMany(
            { userID: new ObjectId(userID) },
            { $set: {
                userID: null, 
                author: "utilisateur supprimé" 
            }}
        );
        console.log("admin post modif success");

        await db.collection("flagged_posts").updateMany(
            { userID: new ObjectId(userID) },
            { $set: {
                userID: null, 
                author: "utilisateur supprimé" 
            }}
        );
        console.log("flagged post modif success");

        await db.collection("comments").updateMany(
            { userID: new ObjectId(userID) },
            { $set: {
                userID: null, 
                author: "utilisateur supprimé" 
            }}
        );
        console.log("comments modif success");

        await db.collection("friends").updateMany(
            { friend1ID: new ObjectId(userID) },
            { $set: {
                friend1ID: null,
                friend1_name: "utilisateur supprimé"
            }}
        );
        console.log("friends1 modif success");
        await db.collection("friends").updateMany(
            { friend2ID: new ObjectId(userID) },
            { $set: {
                friend2ID: null,
                friend2_name: "utilisateur supprimé"
            }}
        );
        console.log("friends2 modif success");

        
        await db.collection("friend_requests").deleteMany({ $or: [ 
            { recipientID: new ObjectId(userID) },
            { senderID: new ObjectId(userID) }
        ]});
        console.log("friend reqs delete success");

        await db.collection("profile_pictures").deleteOne({ user: new ObjectId(userID) });
        console.log("pfp delete success");

        await db.collection("users").deleteOne({ _id: new ObjectId(userID) });
        console.log("user delete success");

        res.status(200).json({ message: "suppression réussie" });
    } catch(err) {
        console.error("deletion error:",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;