const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const sharp = require('sharp');

const uri = process.env.MONGODB_URI || "mongodb+srv://Ploenypp:technoweb017-SU25@lu3in017-su2025.mopemx5.mongodb.net/?retryWrites=true&w=majority&appName=LU3IN017-SU2025";
const client = new MongoClient(uri);

const iconDir = path.join(__dirname, '../../icons');
const resizeSize = 512;

async function uploadIcons() {
    try {
        await client.connect();
        const db = client.db("IN017");
        const icons = db.collection("icons");

        // Optional: clear previous icons if needed
        await icons.deleteMany({}); 

        const files = fs.readdirSync(iconDir);
        const imageFiles = files.filter(file => /\.(jpe?g|png)$/i.test(file));

        for (const file of imageFiles) {
            const filePath = path.join(iconDir, file);
            const buffer = await sharp(filePath)
                .trim()
                .resize(resizeSize, resizeSize, {
                    fit: 'inside',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toFormat('webp')
                .toBuffer();

            await icons.insertOne({
                contentType: 'image/webp',
                image: buffer,
                name: file.replace(/\.(jpe?g|png)$/i, '.webp')
            });

            console.log(`Uploaded as WebP: ${file}`);
        }

        console.log('All icon images uploaded successfully as WebP!');
    } catch (err) {
        console.error('Error uploading icons:', err);
    } finally {
        await client.close();
    }
}

uploadIcons();