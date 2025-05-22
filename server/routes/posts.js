const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson'); 

// publier une nouvelle publication dans le forum général
router.post('/new-post', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }

    const userID = req.session.userID;
    const { title, content } = req.body;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();
        const posts = db.collection("posts");

        // vérifier si le titre a déjà été pris
        const existingPost = await posts.findOne({ title });
        if (existingPost) { return res.status(400).json({ message: "titre déjà pris" })}

        // récupérer le nom de l'auteur
        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json( {message: "user not found", userID }); }
        const author = `${user.fstname} ${user.surname}`;

        await posts.insertOne({ title, author, "userID": new ObjectId(userID), timestamp, content });

        res.status(201).json({ message: "post published" });
    } catch(err) {
        console.error("error publishing post",err);
        res.status(500).json({ message: "internal server error"});
    }
});

// récupérer toutes les publications du forum administrateur
router.get('/all-posts', async(req,res) => {
    try {
        const db = await getDB();
        const posts = await db.collection("posts").find().sort({'_id': -1}).toArray();
        res.status(200).json(posts);
    } catch(err) {
        console.error("error fetching posts",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// publier une commentaire à une publication dans le forum général ou le forum administrateur
router.post('/new-comment/:parentPostID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;
    const parentPostID = req.params.parentPostID;
    const { content } = req.body;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();

        // récupérer le nom de l'auteur
        const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });
        if (!user) { return res.status(404).json( {message: "user not found", userID }); }
        const author = `${user.fstname}_${sur.surname}`

        await db.collection("comments").insertOne({ "parentPostID": new ObjectId(parentPostID), author, "userID": new ObjectId(userID), timestamp, content });

        res.status(201).json({ message: "comment published" });
    } catch(err) {
        console.error("error publishing comment :",err);
        res.status(500).json({ message: "internal server error"});
    }
});

// récupérer les commentaires d'une publication dans le forum général ou le forum administrateur
router.get('/comments/:parentPostID', async(req,res) => {
    const parentPostID = req.params.parentPostID;
    try {
        const db = await getDB();
        const comments = await db.collection("comments").find({ 'parentPostID': new ObjectId(parentPostID) }).toArray();
        res.status(200).json(comments);
    } catch(err) {
        console.error("error fetching comments :", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// récupérer les posts d'un utilisateur
router.get('/:userID', async(req,res) => {
    const userID = req.params.userID;
    try {
        const db = await getDB();
        const posts = await db.collection("posts").find({ userID: new ObjectId(userID) }).sort({'_id': -1}).toArray();
        res.status(200).json(posts);
    } catch(err) {
        console.error("error fetching user's posts",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// supprimer une publication dans le forum général
router.delete('/delete-post/:postID', async(req,res) => {
    const postID = req.params.postID;
    try {
        const db = await getDB();
        await db.collection("posts").deleteOne({ _id: new ObjectId(postID) });
        await db.collection("comments").deleteMany({ parentPostID: new ObjectId(postID) }); // supprimer ses commentaires
        await db.collection("flagged_posts").deleteOne({ _id: new ObjectId(postID) }); // supprimer la signalisation si signalée

        res.status(200).json({ message: "post deleted" });
    } catch(err) {
        console.error("error deleting post :",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// signaler une publication dans le forum général
router.post('/flag-post/:postID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;
    const postID = req.params.postID;

    try {
        const db = await getDB();
        const flagged_posts = db.collection("flagged_posts");

        // récupérer les information de la publication
        const post = await db.collection("posts").findOne({ _id: new ObjectId(postID) });
        const authorID = post.userID;
        const author = post.author;
        const title = post.title;
        const content= post.content;

        const alreadyFlagged = await flagged_posts.findOne({ _id: new ObjectId(postID) });
        if (alreadyFlagged) { // vérifier si la publication a déjà été signalée
            const byUser = alreadyFlagged.users.some((id) => id.toString() === userID.toString());

            if (!byUser) { // vérifier si l'utilisateur connecté l'a déjà signalée
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
        } else { // signaler pour la première fois
            await flagged_posts.insertOne({ 
                _id: new ObjectId(postID),
                reports: 1,
                users: [new ObjectId(userID)],
                authorID: authorID,
                author: author,
                title: title,
                content: content
            });
            
            if (authorID){ // envoyer une notification à l'auteur s'il n'a pas été supprimé et si c'est la première fois que la publication a été signalisée 
                await db.collection("notifications").insertOne({
                recipientID: new ObjectId(authorID),
                subject : `Votre publication "${title}" a été signalée.`,
                body : "Un administrateur examinera votre publication et décidera s'elle doit être restaurée ou supprimée. Vous serez informé de la décision."
                })
            }
            return res.status(201).json({ message: "post reported" });
        }
    } catch(err) {
        console.error("error reporting post", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// vérifier si l'utilisateur connecté a signalé la publication
router.get('/check-flagged/:postID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;
    const postID = req.params.postID;

    try {
        const db = await getDB();
        const post = await db.collection("flagged_posts").findOne({ _id: new ObjectId(postID) });

        if (post) {
            const byUser = Array.isArray(post.users) && post.users.some((id) => id.toString() === userID.toString()); // vérifier si l'utilisateur a signalé
            return res.status(200).json(byUser);
        }
        return res.status(200).json(false);
    } catch(err) {
        console.error("error getting report info :", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// retirer la signalisation de l'utilisateur connecté
router.post('/unflag-post/:postID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
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
                        $inc: { reports: -1 }, // decrementer le nombrer des signalisations
                        $pull: { users: new ObjectId(userID) } // retirer l'utilisateur de la liste
                    }
                );
                
                if (post.reports <= 1) { await posts.deleteOne({ _id: new ObjectId(postID) }); } // retirer le sommaire des signalisations si personne ne la signale plus

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

// modifier une publication dans le form général
router.patch('/edit-post/:postID', async(req,res) => {
    const postID = req.params.postID;
    const { edit } = req.body;
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