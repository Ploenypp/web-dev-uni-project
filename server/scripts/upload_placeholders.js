const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const sharp = require('sharp');

const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
const client = new MongoClient(uri);

const placeholderDir = path.join(__dirname, '../../placeholders');
const resizeSize = 512;

async function uploadPlaceholders() {
    try {
        await client.connect();
        const db = client.db("IN017");
        const placeholders = db.collection("placeholders");

        // Optional: clear previous placeholders if needed
        await placeholders.deleteMany({}); 

        const files = fs.readdirSync(placeholderDir);
        const imageFiles = files.filter(file => /\.(jpe?g|png)$/i.test(file));

        for (const file of imageFiles) {
            const filePath = path.join(placeholderDir, file);
            const buffer = await sharp(filePath)
                .resize(resizeSize, resizeSize, {
                    fit: 'cover',
                    position: 'center'
                })
                .toFormat('webp')
                .toBuffer();

            await placeholders.insertOne({
                contentType: 'image/webp',
                image: buffer,
                name: file.replace(/\.(jpe?g|png)$/i, '.webp')
            });

            console.log(`Uploaded as WebP: ${file}`);
        }

        console.log('All placeholder images uploaded successfully as WebP!');
    } catch (err) {
        console.error('Error uploading placeholders:', err);
    } finally {
        await client.close();
    }
}

uploadPlaceholders();