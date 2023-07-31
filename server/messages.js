const https = require('https');
const mysql = require('mysql2');
const express = require('express')
//const app = express()
console.log('messages.js fichier')
const router = express.Router();
// Route GET pour récupérer les informations de l'utilisateur
module.exports = (connection) => {

    router.get('/messagesWithCurrentUser', (req, res) => {
        console.log('messages.js fichier')

        const currentId  = req.query.currentId;
        const selectedUserId  =req.query.selectedUserId;

        console.log(currentId);
        // Faites une requête SQL pour récupérer tous les utilisateurs sauf celui en ligne actuellement
        // connection.query('SELECT * FROM messages WHERE sender = ? && receiver = ?', [currentId,selectedUserId], (err, rows) => {
            connection.query('SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY date ASC, hour ASC;', [currentId, selectedUserId, selectedUserId, currentId], (err, rows) => {
                //if (err) {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête:', err);
            res.status(500).send('Erreur lors de la récupération des utilisateurs');
        } else {
            console.log(rows);
            res.json(rows);
        }
        });
    });

    //register
    router.post('/addMessage', (req, res) => {
      
    });
    
  


  return router;
};

