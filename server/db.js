const { MongoClient } = require("mongodb");
require('dotenv').config();
const uri = process.env.MONGODB_URI;

// connecter au cluster Atlas
const client = new MongoClient(uri);

// fonction pour se connecter à la base de données
async function connectDB() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");

        await client.db("admin").command({ ping: 1});
        console.log("Pinged your deployment. Successfuly connected to MongoDB");
    } catch (err) {
        console.log(err.stack);
    }
}

// fonction pour récuperer la base de données
async function getDB() {
    return client.db("IN017");
}

// fonction pour créer des indexes de recherche de publications
async function setSearchIndexes() {
    const db = await getDB();
    await db.collection("posts").createIndex({
      title: "text",
      content: "text",
      author: "text"
    });
    await db.collection("users").createIndex({
        fstname: "text",
        surname: "text",
        status: "text",
        team: "text"
    });
}

// exporter les fonctions
module.exports = { 
    connectDB,
    getDB,
    setSearchIndexes
};