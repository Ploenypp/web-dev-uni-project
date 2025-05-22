const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson'); 

// chercher parmis tous les utilisateurs
router.get('/all-users', async(req,res) => {
    const prompt = req.query.prompt;
    try {
        const db = await getDB();
        await db.collection("users").createIndex({
            fstname: "text",
            surname: "text",
            status: "text",
            team: "text"
        });
        const users = db.collection("users");
        const results = await users.find({
            $text: { $search: prompt }
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.json(results);
    } catch(err) {
        console.error("searching users failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// chercher toutes les publications dans le forum général par le texte d'enquête
router.get('/all-posts/text', async(req,res) => {
    const prompt = req.query.prompt;
    try {
        const db = await getDB();
        await db.collection("posts").createIndex({
            title: "text",
            content: "text",
            author: "text"
        });
        const posts = db.collection("posts");
        const results = await posts.find({
            $text: { $search: prompt }
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.json(results);
    } catch(err) {
        console.error("searching posts failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// chercher toutes les publications dans le forum général par leur date de publication
router.get('/all-posts/date', async(req,res) => {
    const { date } = req.query;
    const searchDate = new Date(date);
    const start = new Date(searchDate.setHours(0,0,0,0));
    const end = new Date(searchDate.setHours(23,59,59,999));

    try {
        const db = await getDB();
        const posts = db.collection("posts");

        const results = await posts.find({
            timestamp: { $gte: start, $lte: end }
        }).toArray();

        res.status(200).json(results);
    } catch(err) {
        console.error("searching dates failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// chercher toutes les publications dans le forum général par le texte d'enquête et leur date de publication
router.get('/all-posts/text-date', async(req,res) => {
    const { prompt, date } = req.query;
    const searchDate = new Date(date);
    const start = new Date(searchDate.setHours(0,0,0,0));
    const end = new Date(searchDate.setHours(23,59,59,999));

    try {
        const db = await getDB();
        await db.collection("posts").createIndex({
            title: "text",
            content: "text",
            author: "text"
        });
        const posts = db.collection("posts");
        const results = await posts.find({
            $text: { $search: prompt },
            timestamp: { $gte: start, $lte: end }

        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.json(results);
    } catch(err) {
        console.error("searching posts and dates failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// chercher parmis tous les utilisateurs administrateurs
router.get('/admin-users', async(req,res) => {
    const prompt = req.query.prompt;
    try {
        const db = await getDB();
        await db.collection("users").createIndex({
            fstname: "text",
            surname: "text",
            status: "text",
            team: "text"
        });
        const users = db.collection("users");
        const results = await users.find({
            $text: { $search: prompt },
            status: "admin",
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.json(results);
    } catch(err) {
        console.error("searching users failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// chercher toutes les publications dans le forum administrateur par le texte d'enquête
router.get('/admin-posts/text', async(req,res) => {
    const prompt = req.query.prompt;
    try {
        const db = await getDB();
        await db.collection("admin_posts").createIndex({
            title: "text",
            content: "text",
            author: "text"
        });
        const posts = db.collection("admin_posts");
        const results = await posts.find({
            $text: { $search: prompt }
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.json(results);
    } catch(err) {
        console.error("searching posts failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// chercher toutes les publications dans le forum administrateur par leur date de publication
router.get('/admin-posts/date', async(req,res) => {
    const { date } = req.query;
    const searchDate = new Date(date);
    const start = new Date(searchDate.setHours(0,0,0,0));
    const end = new Date(searchDate.setHours(23,59,59,999));

    try {
        const db = await getDB();
        const posts = db.collection("admin_posts");

        const results = await posts.find({
            timestamp: { $gte: start, $lte: end }
        }).toArray();

        res.status(200).json(results);
    } catch(err) {
        console.error("searching dates failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// chercher toutes les publications dans le forum administrateur par le texte d'enquête et leur date de publication
router.get('/admin-posts/text-date', async(req,res) => {
    const { prompt, date } = req.query;
    const searchDate = new Date(date);
    const start = new Date(searchDate.setHours(0,0,0,0));
    const end = new Date(searchDate.setHours(23,59,59,999));

    try {
        const db = await getDB();
        await db.collection("admin_posts").createIndex({
            title: "text",
            content: "text",
            author: "text"
        });
        const posts = db.collection("admin_posts");
        const results = await posts.find({
            $text: { $search: prompt },
            timestamp: { $gte: start, $lte: end }

        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.json(results);
    } catch(err) {
        console.error("searching posts and dates failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;