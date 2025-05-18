const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
//const { ObjectId } = require('bson');

const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
const client = new MongoClient(uri);

router.post('/upload_pfp', upload.single('image'), async (req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "pas connecté" });
    }
    const userID = req.session.userId;

    try {
        await client.connect();
        const db = client.db("IN017");
        const pfps = db.collection('profile_pictures');

        const buffer = await sharp(req.file.buffer)
        .resize(512, 512, {
            fit: 'cover',
            position: 'center'
        })
        .toFormat('webp')
        .toBuffer();

        const img = {
            contentType: 'image/webp',
            image: buffer,
            user: new ObjectId(userID)
        };

        const prev = await pfps.findOne({ user: new ObjectId(userID) });
        if (prev) { await pfps.deleteOne({ user: new ObjectId(userID) }) };

        await db.collection('profile_pictures').insertOne(img);

        res.status(201).json({ message: 'upload successful' });
    } catch(err) {
        console.error("pfp upload error",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/load_pfp/:id', async(req,res) => {
    const pfp_userID = req.params.id;

    console.log("Looking for user:", pfp_userID, typeof pfp_userID);
    console.log("Converted to ObjectId:", new ObjectId(pfp_userID));

    try {
        await client.connect();
        const db = client.db("IN017");

        if (!ObjectId.isValid(pfp_userID)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        let pfp = await db.collection('profile_pictures').findOne({ user: new ObjectId(pfp_userID) });

        console.log("Retrieved pfp:", pfp);

        if (!pfp) { 
            const user = await db.collection('users').findOne({ _id: new ObjectId(pfp_userID) });
            if (!user) { return res.status(404).json({ message: "user not found" }); }
            
            const fstInit = user.fstname[0].toUpperCase();

            pfp = await db.collection('placeholders').findOne({ name: fstInit + ".webp" });
        }

        console.log("user:",pfp_userID);
        console.log("pfp",pfp);

        {/*console.log('Placeholder image document:', pfp);
        console.log("type", typeof pfp.image);
        console.log("buffer", Buffer.isBuffer(pfp.image));
        console.log("binary", pfp.image && pfp.image._bsontype === "Binary");
        console.log("keys", pfp.image && Object.keys(pfp.image));*/}

        res.contentType(pfp.contentType);
        res.set('Cache-Control', 'no-store');
        res.send(pfp.image.buffer || pfp.image);

    } catch(err) {
        console.error("pfp retrieval error",err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;