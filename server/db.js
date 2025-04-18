const { MongoClient } = require("mongodb");
require('dotenv').config();
 
// Replace the following with your Atlas connection string                                                                         
const uri = process.env.MONGODB_URI;

// Connect to your Atlas cluster
const client = new MongoClient(uri);

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

module.exports = connectDB;