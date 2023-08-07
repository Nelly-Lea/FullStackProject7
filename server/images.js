// const express = require('express');
// const multer = require('multer');
// const mysql = require('mysql2');
// const https = require('https');
// const app = express()
// const router = express.Router();

// // Configurations pour le stockage des fichiers
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// module.exports = (connection) => {

//     // Route pour l'upload de l'image
//     router.post('/upload', upload.single('image'), (req, res) => {
//         const image = req.file;
//         const name = image.originalname;
//         const mimeType = image.mimetype;
//         const data = image.buffer;

//         const query = 'INSERT INTO images (name, mime_type, data) VALUES (?, ?, ?)';
//         connection.query(query, [name, mimeType, data], (err, result) => {
//             if (err) {
//                 console.error('Error uploading image', err);
//                 res.status(500).json({ error: 'Error uploading image' });
//             } else {
//                 res.status(200).json({ message: 'Image uploaded successfully' });
//             }
//         });
//     });

//     // Route pour récupérer une image par son ID
//     router.get('/image/:id', (req, res) => {
//         const imageId = req.params.id;
//         const query = 'SELECT name, mime_type, data FROM images WHERE id = ?';
//         connection.query(query, [imageId], (err, result) => {
//             if (err) {
//                 console.error('Error fetching image', err);
//                 res.status(500).json({ error: 'Error fetching image' });
//             } else {
//                 const image = result[0];
//                 res.setHeader('Content-Type', image.mime_type);
//                 res.end(image.data);
//             }
//         });
//     });
// }

