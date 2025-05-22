const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson');

router.get('/flagged-posts', async(req,res) => {
    try {
        const db = await getDB();
        const flagged = await db.collection("flagged_posts").find().sort({ 'reports': -1 }).toArray();
        res.json(flagged);
    } catch(err) {
        console.error("error fetching flagged posts",err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get('/all-users', async(req,res) => {
    try {
        const db = await getDB();
        const users = await db.collection("users").find().sort({ 'surname': 1 }).toArray();
        res.json(users);
    } catch(err) {
        console.error("error fetching users",err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get('/registrations', async(req,res) => {
    try {
        const db = await getDB();
        const registrations = await db.collection("registrations").find().sort({ '_id': 1 }).toArray();
        res.json(registrations);
    } catch(err) {
        console.error("error fetching registration requests",err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.post('/accept-registration/:regID', async(req,res) => {
    const regID = req.params.regID;
    const { status, team } = req.body;

    try {
        const db = await getDB();
        const reg = await db.collection("registrations").findOne({ _id: new ObjectId(regID) });
        await db.collection("users").insertOne( { 
            fstname: reg.fstname, 
            surname: reg.surname, 
            dob: reg.dob, 
            username: reg.username, 
            password: reg.password, 
            status: status, 
            team: team 
        });
        await db.collection("registrations").deleteOne({ _id : new ObjectId(regID) });

        res.status(201).json({ message: "registration accepted" });
    } catch(err) {
        console.error("error accepting registration", err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.delete('/reject-registration/:regID', async(req,res) => {
    const regID = req.params.regID;
    try {
        const db = await getDB();
        await db.collection("registrations").deleteOne({ _id: new ObjectId(regID) });
        res.status(200).json({ message: "registration rejected" });
    } catch(err) {
        console.error("error rejecting registration", err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.patch('/change-status/:userID', async(req,res) => {
    const userID = req.params.userID;
    const { newStatus } = req.body;

    try {
        const db = await getDB();
        db.collection("users").updateOne(
            { _id: new ObjectId(userID) },
            { $set: { status: newStatus } }
        );
        res.status(200).json({ message: "status changed" });
    } catch(err) {
        console.error("error changing status", err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.patch('/assign-team/:userID', async(req,res) => {
    const userID = req.params.userID;
    const { assignedTeam } = req.body;

    try {
        const db = await getDB();
        db.collection("users").updateOne(
            { _id: new ObjectId(userID) },
            { $set: { team: assignedTeam } }
        );
        res.status(200).json({ message: "team assigned" });
    } catch(err) {
        console.error("error assigning team", err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.post('/new-post', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }
    const userID = req.session.userID;
    const { title, content } = req.body;
    const timestamp = new Date(Date.now());
    console.log(userID);

    try {
        const db = await getDB();
        const posts = db.collection("admin_posts");

        const existingPost = await posts.findOne({ title });
        if (existingPost) { return res.status(400).json({ message: "titre déjà pris" })}

        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json( {message: "user not found", userID }); }
        const author = user.fstname.concat(" ",user.surname);

        await posts.insertOne({ title, author, "userID": new ObjectId(userID), timestamp, content });
        res.status(201).json({ message: "publication réussie" });

    } catch(err) {
        console.error("publication error:",err);
        res.status(500).json({ message: "Internal server error"});
    }
});

router.patch('/edit-post/:postID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    
    const postID = req.params.postID;
    const { edit } = req.body;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();

        await db.collection("admin_posts").updateOne(
            {_id: new ObjectId(postID)},
            { $set: {
                content: edit,
                editDate: timestamp,
                edited: true
            }}
        );

        res.status(200).json({ message: "edit successful"});

    } catch(err) {
        console.error("edit error",err);
        res.status(500).err({ message: "Internal server error" });
    }
});

router.delete('/delete-post/:postID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }

    const postID = req.params.postID;

    try {
        const db = await getDB();

        await db.collection("admin_posts").deleteOne({ _id: new ObjectId(postID) });
        await db.collection("comments").deleteMany({ parentPostID: new ObjectId(postID) });
        await db.collection("flagged_posts").deleteOne({ _id: new ObjectId(postID) });

        res.status(200).json({ message: "post deleted" });
    } catch(err) {
        console.error("error deleting post :",err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get('/posts', async(req,res) => {
    try {
        const db = await getDB();
        const posts = await db.collection("admin_posts").find().sort({'_id': -1}).toArray();
        res.json(posts);
    } catch(err) {
        console.error("error fetching posts :",err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.post('/flag-post/:postID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    
    const userID = req.session.userID;
    const postID = req.params.postID;

    try {
        const db = await getDB();
        const flagged_posts = db.collection("flagged_posts");

        const post = await db.collection("admin_posts").findOne({ _id: new ObjectId(postID) });
        const authorID = post.userID;
        const author = post.author;
        const title = post.title;
        const content= post.content;

        const alreadyFlagged = await flagged_posts.findOne({ _id: new ObjectId(postID) });
        if (alreadyFlagged) { 
            const byUser = alreadyFlagged.users.some((id) => id.toString() === userID.toString());

            if (!byUser) { 
                await flagged_posts.updateOne(
                    { _id: new ObjectId(postID) }, 
                    {
                        $inc: { reports: 1 },
                        $push: {users: new ObjectId(userID) } 
                    }
                ); 
                return res.status(201).json({ message: "post reported" });
            } else {
                return res.status(201).json({ message: "user already reported" });
            }

        } else {
            await flagged_posts.insertOne({ 
                _id: new ObjectId(postID),
                reports: 1,
                users: [new ObjectId(userID)],
                authorID: authorID,
                author: author,
                title: title,
                content: content
            });

            if (authorID){
                await db.collection("notifications").insertOne({
                recipientID: new ObjectId(authorID),
                subject : `Votre publication "${title}" a été signalée.`,
                body : "Un administrateur examinera votre publication et décidera s'elle doit être restaurée ou supprimée. Vous serez informé de la décision."
                })
            }

            return res.status(201).json({ message: "post reported" });
        }
    } catch(err) {
        console.error("error reporting post :", err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.delete('/delete-flagged-post/:postID/:authorID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }
    console.log(req.session.userID);

    const { postID, authorID } = req.params;
    const { postTitle, warning }= req.query;

    try {
        const db = await getDB();

        await db.collection("posts").deleteOne({ _id: new ObjectId(postID) });
        console.log("delete post success");
        await db.collection("admin_posts").deleteOne({ _id: new ObjectId(postID) });
        console.log("delete post success");

        await db.collection("comments").deleteMany({ parentPostID: new ObjectId(postID) });
        console.log("delete comments success");

        await db.collection("flagged_posts").deleteOne({ _id: new ObjectId(postID) });
        console.log("delete report success");

        if (authorID){
            await db.collection("notifications").insertOne({ 
                recipientID: new ObjectId(authorID),
                subject: `Votre publication "${postTitle}" a été signalée et supprimée.`,
                body: warning
            });
        }
        console.log("notification sent success");

        return res.status(200).json({ message: "flagged post deleted" });
    } catch(err) {
        console.error("error deleting flagged post :",err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.post('/restore-flagged-post/:postID/:authorID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }
    console.log(req.session.userID);

    const { postID, authorID } = req.params;
    const { postTitle } = req.body;

    try {
        const db = await getDB();

        await db.collection("flagged_posts").deleteOne({ _id: new ObjectId(postID) });
        await db.collection("notifications").insertOne({
            recipientID: new ObjectId(authorID),
            subject: `Votre publication "${postTitle}" n'est plus signalée.`,
            body: null
        });

        res.status(201).json({ message: "flagged post restored, notification sent" });
    } catch(err) {
        console.error("flagged post restoration error:",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete('/delete-user/:id', async(req,res) => {
    const userID = req.params.id;

    const { fstname, surname } = req.query;

    try {
        const db = await getDB();

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

        const friends1 = await db.collection("friends").find({ friend1ID: new ObjectId(userID) }).toArray();
        for (const f of friends1) {
            await db.collection("notifications").insertOne({
                recipientID: new ObjectId(f.friend2ID),
                subject: `Votre amie(e) ${fstname} ${surname} a quitté l'organisation.`,
                body: "Nous avons supprimé votre chat."
            })
        }
        await db.collection("friends").deleteMany({ friend1ID: new ObjectId(userID) });
        console.log("friends1 delete success");

        const friends2 = await db.collection("friends").find({ friend2ID: new ObjectId(userID) }).toArray();
        for (const f of friends2) {
            await db.collection("notifications").insertOne({
                recipientID: new ObjectId(f.friend1ID),
                subject: `Votre amie(e) ${fstname} ${surname} a quitté l'organisation.`,
                body: "Nous avons supprimé votre chat."
            })
        }
        await db.collection("friends").deleteMany({ friend2ID: new ObjectId(userID) });
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