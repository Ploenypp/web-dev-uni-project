const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('bson'); 

// chercher parmis tous les utilisateurs
router.get('/all-users', async(req,res) => {
    const prompt = req.query.prompt;
    try {
        const db = await getDB();
        const users = db.collection("users");
        const results = await users.find({
            $text: { $search: prompt }
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.status(200).json(results);
    } catch(err) {
        console.error("error searching users", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// chercher toutes les publications dans le forum général par le texte d'enquête
router.get('/all-posts/text', async(req,res) => {
    const prompt = req.query.prompt;
    const cleanPrompt = prompt.trim().toLowerCase();
    try {
        const db = await getDB();
        const posts = db.collection("posts");
        const results = await posts.find({
            $text: { $search: cleanPrompt }
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.json(results);
    } catch(err) {
        console.error("error searching posts", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// chercher toutes les publications dans le forum général par une intervalle de temps
router.get('/all-posts/date', async (req, res) => {
    const { start, end } = req.query;
    try {
        const startDate = new Date(start);
        startDate.setHours(0,0,0,0);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999); // inclure la fin du jour

        const db = await getDB();
        const posts = db.collection("posts");

        const results = await posts.find({
            timestamp: { $gte: startDate, $lte: endDate }
        }).toArray();

        res.status(200).json(results);
    } catch (err) {
        console.error("error searching posts by date range", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// chercher toutes les publications dans le forum général par le texte d'enquête et une intervalle de temps
router.get('/all-posts/text-date', async (req, res) => {
    const { prompt, start, end } = req.query;
    const cleanPrompt = prompt.trim().toLowerCase();
    try {
        const startDate = new Date(start);
        startDate.setHours(0,0,0,0);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999); // intervalle inclusive

        const db = await getDB();
        const posts = db.collection("posts");
        const results = await posts.find({
            $text: { $search: cleanPrompt },
            timestamp: { $gte: startDate, $lte: endDate }
        }).sort({ score: { $meta: "textScore" } }).toArray();

        res.status(200).json(results);
    } catch (err) {
        console.error("error searching posts by text and date range", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// chercher parmis tous les utilisateurs administrateurs
router.get('/admin-users', async(req,res) => {
    const prompt = req.query.prompt;
    try {
        const db = await getDB();
        const users = db.collection("users");
        const results = await users.find({
            $text: { $search: prompt },
            status: "admin",
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.status(200).json(results);
    } catch(err) {
        console.error("error searching admin users", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// chercher toutes les publications dans le forum administrateur par le texte d'enquête
router.get('/admin-posts/text', async(req,res) => {
    const prompt = req.query.prompt;
    const cleanPrompt = prompt.trim().toLowerCase();
    try {
        const db = await getDB();
        const posts = db.collection("admin_posts");
        const results = await posts.find({
            $text: { $search: cleanPrompt }
        }).sort({ score: { $meta: "textScore" } }).toArray();
        res.status(200).json(results);
    } catch(err) {
        console.error("error searching admin posts", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// chercher toutes les publications dans le forum administrateur par une intervalle de temps
router.get('/admin-posts/date', async(req,res) => {
    const { start, end } = req.query;
    try {
        const startDate = new Date(start);
        startDate.setHours(0,0,0,0);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999); // inclure la fin du jour

        const db = await getDB();
        const posts = db.collection("admin_posts");

        const results = await posts.find({
            timestamp: { $gte: startDate, $lte: endDate }
        }).toArray();

        res.status(200).json(results);
    } catch (err) {
        console.error("error searching admin posts by date range", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// chercher toutes les publications dans le forum administrateur par le texte d'enquête et par une intervalle de temps
router.get('/admin-posts/text-date', async(req,res) => {
    const { prompt, start, end } = req.query;
    const cleanPrompt = prompt.trim().toLowerCase();
    try {
        const startDate = new Date(start);
        startDate.setHours(0,0,0,0);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999); // intervalle inclusive

        const db = await getDB();

        const posts = db.collection("admin_posts");
        const results = await posts.find({
            $text: { $search: cleanPrompt },
            timestamp: { $gte: startDate, $lte: endDate }
        }).sort({ score: { $meta: "textScore" } }).toArray();

        res.status(200).json(results);
    } catch (err) {
        console.error("error searching admin posts by text and date range", err);
        res.status(500).json({ message: "internal server error" });
    }
});

module.exports = router;