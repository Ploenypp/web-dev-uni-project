const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson');

// retourner tous les publications signalées
router.get('/flagged-posts', async(req,res) => {
    try {
        const db = await getDB();
        const flagged = await db.collection("flagged_posts").find().sort({ 'reports': -1 }).toArray();
        res.status(200).json(flagged);
    } catch(err) {
        console.error("error fetching flagged posts",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// retourner tous les utilisateurs (membres et administrateurs)
router.get('/all-users', async(req,res) => {
    try {
        const db = await getDB();
        const users = await db.collection("users").find().sort({ 'surname': 1 }).toArray();
        res.status(200).json(users);
    } catch(err) {
        console.error("error fetching users",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// retourner toutes les requêtes d'inscription en attente
router.get('/registrations', async(req,res) => {
    try {
        const db = await getDB();
        const registrations = await db.collection("registrations").find().sort({ '_id': 1 }).toArray();
        res.status(200).json(registrations);
    } catch(err) {
        console.error("error fetching registration requests",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// accepter une requête d'inscription, ajouter le nouveau utilisateur
router.post('/accept-registration/:regID', async(req,res) => {
    const regID = req.params.regID;
    const { status, team } = req.body;

    try {
        const db = await getDB();
        const reg = await db.collection("registrations").findOne({ _id: new ObjectId(regID) }); // récuperer les informations de l'utilisateur

        await db.collection("users").insertOne( { // ajouter l'utilisateur
            fstname: reg.fstname, 
            surname: reg.surname, 
            dob: reg.dob, 
            username: reg.username, 
            password: reg.password, 
            status: status, 
            team: team 
        });
        await db.collection("registrations").deleteOne({ _id : new ObjectId(regID) }); // supprimer la requête d'inscription

        res.status(201).json({ message: "registration accepted" });
    } catch(err) {
        console.error("error accepting registration", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// rejeter une requête d'inscription
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

// changer le statut d'un utilisateur (membre/administrateur)
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

// changer l'équipe d'un utilisateur 
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

// publier une nouvelle publication dans le forum des administrateurs
router.post('/new-post', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;
    const { title, content } = req.body;
    const timestamp = new Date(Date.now());

    try {
        const db = await getDB();
        const posts = db.collection("admin_posts");

        // vérifier si le titre a déjà été pris
        const existingPost = await posts.findOne({ title }); 
        if (existingPost) { return res.status(400).json({ message: "title taken" })}

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

// modifier le contenu d'une publication
router.patch('/edit-post/:postID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    
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
        console.error("error editing post",err);
        res.status(500).err({ message: "internal server error" });
    }
});

// supprimer une publication dans le forum adminstrateur
router.delete('/delete-post/:postID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }

    const postID = req.params.postID;

    try {
        const db = await getDB();
        await db.collection("admin_posts").deleteOne({ _id: new ObjectId(postID) });
        await db.collection("comments").deleteMany({ parentPostID: new ObjectId(postID) }); // supprimer ses commentaires
        await db.collection("flagged_posts").deleteOne({ _id: new ObjectId(postID) }); // supprimer la signalisation si signalée

        res.status(200).json({ message: "post deleted" });
    } catch(err) {
        console.error("error deleting post",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// récupérer toutes les publications du forum administrateur
router.get('/posts', async(req,res) => {
    try {
        const db = await getDB();
        const posts = await db.collection("admin_posts").find().sort({'_id': -1}).toArray();
        res.status(200).json(posts);
    } catch(err) {
        console.error("error fetching posts",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// signaler une publication dans le forum administrateur
router.post('/flag-post/:postID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }
    const userID = req.session.userID;
    const postID = req.params.postID;

    try {
        const db = await getDB();
        const flagged_posts = db.collection("flagged_posts");

        // récupérer les information de la publication
        const post = await db.collection("admin_posts").findOne({ _id: new ObjectId(postID) });
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
                        $inc: { reports: 1 }, // incrementer le nombre des signalisations
                        $push: {users: new ObjectId(userID) } // ajouter l'utilisateur à la liste
                    }
                ); 
                return res.status(201).json({ message: "post reported" });
            } else {
                return res.status(201).json({ message: "user already reported" });
            }
        } else { // signaler pour la première fois
            await flagged_posts.insertOne({ 
                _id: new ObjectId(postID), // utiliser le même ID pour la signalisation que la publication
                reports: 1,
                users: [new ObjectId(userID)], // initialiser la liste des utilisateurs qui l'auraient signalée
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

// supprimer une publication signalée
router.delete('/delete-flagged-post/:postID/:authorID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }

    const { postID, authorID } = req.params;
    const { postTitle, warning }= req.query;

    try {
        const db = await getDB();

        // supprimer la publication (on ne connaît pas son forum)
        await db.collection("posts").deleteOne({ _id: new ObjectId(postID) });
        await db.collection("admin_posts").deleteOne({ _id: new ObjectId(postID) });

        await db.collection("comments").deleteMany({ parentPostID: new ObjectId(postID) }); // supprimer ses commentaires

        await db.collection("flagged_posts").deleteOne({ _id: new ObjectId(postID) }); // supprimer sa signalisation

        if (authorID){ // envoyer une notification à l'auteur s'il n'a pas quitté l'organisation
            await db.collection("notifications").insertOne({ 
                recipientID: new ObjectId(authorID),
                subject: `Votre publication "${postTitle}" a été signalée et supprimée.`,
                body: warning
            });
        }

        return res.status(200).json({ message: "flagged post deleted, notification sent" });
    } catch(err) {
        console.error("error deleting flagged post",err);
        res.status(500).json({ message: "internal server error" });
    }
});

// restaurer une publication signalée
router.post('/restore-flagged-post/:postID/:authorID', async(req,res) => {
    if (!req.session.userID) { return res.status(401).json({ message: "not logged in" }); }

    const { postID, authorID } = req.params;
    const { postTitle } = req.body;

    try {
        const db = await getDB();

        await db.collection("flagged_posts").deleteOne({ _id: new ObjectId(postID) }); // supprimer la signalisation
        
        if (authorID) { // envoyer une notification à l'auteur s'il n'a pas été supprimé
            await db.collection("notifications").insertOne({
                recipientID: new ObjectId(authorID),
                subject: `Votre publication "${postTitle}" n'est plus signalée.`,
                body: null
            });
        }

        res.status(200).json({ message: "flagged post restored, notification sent" });
    } catch(err) {
        console.error("flagged post restoration error:",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// supprimer un utilisateur, ("utilisateur quitte l'organisation")
router.delete('/delete-user/:id', async(req,res) => {
    const userID = req.params.id;

    const { fstname, surname } = req.query;

    try {
        const db = await getDB();

        await db.collection("posts").updateMany( // garder ses publications dans le forum général
            { userID: new ObjectId(userID) },
            { $set: {
                userID: null,
                author: "utilisateur supprimé" // indiquer qu'il a été supprimé
            }}
        );

        await db.collection("admin_posts").updateMany( // garder ses publications dans le forum administrateur
            { userID: new ObjectId(userID) },
            { $set: {
                userID: null, 
                author: "utilisateur supprimé" 
            }}
        );

        await db.collection("flagged_posts").updateMany( // garder les signalisations de ses publications
            { userID: new ObjectId(userID) },
            { $set: {
                userID: null, 
                author: "utilisateur supprimé" 
            }}
        );

        await db.collection("comments").updateMany( // garder ses commentaires
            { userID: new ObjectId(userID) },
            { $set: {
                userID: null, 
                author: "utilisateur supprimé" 
            }}
        );

        // chercher ses amis
        const friends1 = await db.collection("friends").find({ friend1ID: new ObjectId(userID) }).toArray();
        for (const f of friends1) {
            await db.collection("notifications").insertOne({ // envoyer une notification à ses amis
                recipientID: new ObjectId(f.friend2ID),
                subject: `Votre amie(e) ${fstname} ${surname} a quitté l'organisation.`,
                body: "Nous avons supprimé votre chat."
            })
        }
        await db.collection("friends").deleteMany({ friend1ID: new ObjectId(userID) }); // supprimer ses chats

        const friends2 = await db.collection("friends").find({ friend2ID: new ObjectId(userID) }).toArray();
        for (const f of friends2) {
            await db.collection("notifications").insertOne({
                recipientID: new ObjectId(f.friend1ID),
                subject: `Votre amie(e) ${fstname} ${surname} a quitté l'organisation.`,
                body: "Nous avons supprimé votre chat."
            })
        }
        await db.collection("friends").deleteMany({ friend2ID: new ObjectId(userID) });

        // supprimer les requêtes d'amitiés dont il faisait partie
        await db.collection("friend_requests").deleteMany({ $or: [ 
            { recipientID: new ObjectId(userID) },
            { senderID: new ObjectId(userID) }
        ]});

        await db.collection("profile_pictures").deleteOne({ user: new ObjectId(userID) }); // supprimer son photo de profil

        await db.collection("users").deleteOne({ _id: new ObjectId(userID) }); // supprimer ses informations

        res.status(200).json({ message: "user deleted" });
    } catch(err) {
        console.error("error deleting user",err);
        res.status(500).json({ message: "internal server error" });
    }
});

module.exports = router;