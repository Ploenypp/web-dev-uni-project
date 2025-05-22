const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson'); 

router.post('/new-post', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }

    const { title, content } = req.body;
    const userID = req.session.userID;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();
        const posts = db.collection("posts");

        const existingPost = await posts.findOne({ title });
        if (existingPost) { return res.status(400).json({ message: "titre déjà pris" })}

        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json( {message: "user not found", userID }); }
        
        const author = user.fstname.concat(" ",user.surname);

        await posts.insertOne({ title, author, "userID": new ObjectId(userID), timestamp, content });
        res.status(201).json({ message: "publication réussie" });

    } catch(err) {
        console.error("error publishing :",err);
        res.status(500).json({ message: "internal server error"});
    }
});

router.get('/all-posts', async(req,res) => {

    try {
        const db = await getDB();
        const coll = db.collection("posts").find().sort({'_id': -1});
        const posts = await coll.toArray();
    
        res.json(posts);

    } catch(err) {
        console.error("posts not found?",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//CHECK
router.post('/new-comment/:parentPostID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }

    const parentPostID = req.params.parentPostID;
    const content = req.body;
    const userID = req.session.userID;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();

        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json( {message: "user not found", userID }); }
        const author = user.fstname.concat(" ",user.surname);

        await db.collection("comments").insertOne({ "parentPostID": new ObjectId(parentPostID), author, "userID": new ObjectId(userID), timestamp, content });

        res.status(201).json({ message: "comment published" });
    } catch(err) {
        console.error("error publishing comment :",err);
        res.status(500).json({ message: "internal server error"});
    }
});

//CHECK
router.get('/comments/:parentPostID', async(req,res) => {
    const parentPostID = req.params.parentPostID;

    try {
        const db = await getDB();
        const comments = await db.collection("comments").find({ 'parentPostID': new ObjectId(parentPostID) }).toArray();
        res.json(comments || []);
    } catch(err) {
        console.error("error fetching comments :", err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.get('/:userID', async(req,res) => {
    const userID = req.params.userID;

    try {
        const db = await getDB();
        const posts = await db.collection("posts").find({ userID: new ObjectId(userID) }).sort({'_id': -1}).toArray();
        res.json(posts);
    } catch(err) {
        console.error("error fetching user's posts :",err);
        res.status(500).json({ message: "internal server error" });
    }

});

//CHECK 
router.delete('/delete-post/:postID', async(req,res) => {
    const postID = req.params.postID;

    try {
        const db = await getDB();

        await db.collection("posts").deleteOne({ _id: new ObjectId(postID) });
        await db.collection("comments").deleteMany({ parentPostID: new ObjectId(postID) });
        await db.collection("flagged_posts").deleteOne({ _id: new ObjectId(postID) });

        res.status(200).json({ message: "post deleted" });
    } catch(err) {
        console.error("error deleting post :",err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.post('/flag-post/:postID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    const userID = req.session.userID;
    const postID = req.params.postID;

    try {
        const db = await getDB();
        const flagged_posts = db.collection("flagged_posts");

        const post = await db.collection("posts").findOne({ _id: new ObjectId(postID) });
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
                        $push: { users: new ObjectId(userID) } 
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

//CHECK
router.get('/check-flagged/:postID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "not logged in" });
    }
    const userID = req.session.userID;
    const postID = req.params.postID;

    try {
        const db = await getDB();
        const post = await db.collection("flagged_posts").findOne({ _id: new ObjectId(postID) });

        if (post) {
            const byUser = Array.isArray(post.users) && post.users.some((id) => id.toString() === userID.toString());
            return res.status(200).json(byUser);
        }
        return res.status(200).json(false);
    } catch(err) {
        console.error("error getting report info :", err);
        res.status(500).json({ message: "internal server error" });
    }
});

//CHECK
router.post('/unflag-post/:postID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }
    const userID = req.session.userID;
    const postID = req.params.postID;

    try {
        const db = await getDB();
        const posts = db.collection("flagged_posts");
        const post = await posts.findOne({ _id: new ObjectId(postID) });

        if (post) {
            const user = post.users.some((id) => id.toString() === userID.toString());
            
            if (user) {
                await posts.updateOne( 
                    { _id: new ObjectId(postID) },
                    {
                        $inc: { reports: -1 },
                        $pull: { users: new ObjectId(userID) }
                    }
                );
                
                if (post.reports <= 1) { await posts.deleteOne({ _id: new ObjectId(postID) }); }

                return res.status(200).json({ message: "user's report pulled" });
            }

            return res.status(200).json({ message: "user didn't report" });
        } 
        return res.status(200).json({ message: "post wasn't flagged" });
    } catch(err) {
        console.error("error pulling report: ",err);
        res.status(500).err({ message: "internal server error" });
    }
});

router.patch('/edit-post/:postID', async(req,res) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: "pas connecté" });
    }
    
    const postID = req.params.postID;
    const edit = req.body;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();
        await db.collection("posts").updateOne(
            {_id: new ObjectId(postID)},
            { $set: {
                content: edit,
                editDate: timestamp,
                edited: true
            }}
        );
        res.status(200).json({ message: "post edited"});
    } catch(err) {
        console.error("error editing post",err);
        res.status(500).err({ message: "Internal server error" });
    }
});

module.exports = router;