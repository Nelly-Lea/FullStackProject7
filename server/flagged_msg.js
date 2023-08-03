const https = require('https');
const mysql = require('mysql2');
const express = require('express')
const app = express()
console.log('flagged_msg.js fichier')
const router = express.Router();
// Route GET pour récupérer les informations de l'utilisateur
module.exports = (connection) => {
    router.post('/addFlaggedMessage', (req, res) => {
        const newFlaggedMsg = req.body; // Extract the new msg data from the request body
           
        // Define the SQL query to insert the new flagged msg into the 'flagged_msg' table
        const query = 'INSERT INTO flagged_msg SET ?';
      
        connection.query(query, [newFlaggedMsg], (err, results) => {
          if (err) {
            // If an error occurs during the query execution, log the error and send a response with an error message
            console.error('Error in request execution', err);
            res.status(500); // Set the response status to 500 (Internal Server Error)
            return res.send({ error: 'An error occurred adding new flagged message' });
          } else {
            // Get the ID of the newly inserted message
            const newFlaggedMsgId = results.id; 
      
            res.status(200); // Set the response status to 200 (OK)
            res.send({ id: newFlaggedMsgId }); // Return the new flagged message's ID in the response
          }
        });
      });


      router.get('/getAllFlagged_msg', (req, res) => {
        const bool=req.query.checked;
        console.log(bool);
        // Faites une requête SQL pour récupérer tous les messages flaggés non vérifiés
        connection.query('SELECT msgId FROM flagged_msg WHERE checked = ?',[bool], (err, flaggedRows) => {
          if (err) {
            console.error('Erreur lors de l\'exécution de la requête:', err);
            res.status(500).send('Erreur lors de la récupération des messages flaggés');
          } else {
            // Extrayez les msgId de la liste des messages flaggés
            console.log("flaggedRows", flaggedRows);
            const flaggedMsgIds = flaggedRows.map(row => row.msgId);
            console.log("flaggedMsgIds", flaggedMsgIds);
            
            // Recherchez les messages correspondants dans la table des messages
            if (flaggedMsgIds.length > 0) {
              const query = `SELECT * FROM messages WHERE id IN (${flaggedMsgIds.join(',')})`;
      
              connection.query(query, (err, messageRows) => {
                if (err) {
                  console.error('Erreur lors de l\'exécution de la requête:', err);
                  res.status(500).send('Erreur lors de la récupération des messages');
                } else {
                  console.log(messageRows);
                  res.json(messageRows);
                }
              });
            } else {
              // Aucun message flaggé trouvé, renvoyer une réponse vide
              res.json([]);
            }
          }
        });
      });

      router.post('/markMessageChecked/:messageId', (req, res) => {
        const messageId = req.params.messageId;
      
        // Faites une requête SQL pour mettre à jour la variable checked du message flaggé avec l'ID spécifié
        const query = 'UPDATE flagged_msg SET checked = true WHERE msgId = ?';
        connection.query(query, [messageId], (err, result) => {
          if (err) {
            console.error('Erreur lors de l\'exécution de la requête:', err);
            res.status(500).send('Erreur lors de la mise à jour de la variable checked');
          } else {
            res.status(200).send('Variable checked mise à jour avec succès');
          }
        });
      });
      
      router.post('/deleteFlaggedMessage/:messageId', (req, res) => {
        const messageId = req.params.messageId;
      
        // Faites une requête SQL pour supprimer le message flaggé avec l'ID spécifié de la table messages
        const deleteMessageQuery = 'DELETE FROM messages WHERE id = ?';
        connection.query(deleteMessageQuery, [messageId], (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.error('Erreur lors de la suppression du message:', deleteErr);
            res.status(500).send('Erreur lors de la suppression du message');
          } else {
            // Maintenant, supprimez le message flaggé de la table flagged_msg
            const deleteFlaggedMsgQuery = 'DELETE FROM flagged_msg WHERE msgId = ?';
            connection.query(deleteFlaggedMsgQuery, [messageId], (flaggedDeleteErr, flaggedDeleteResult) => {
              if (flaggedDeleteErr) {
                console.error('Erreur lors de la suppression du message flaggé:', flaggedDeleteErr);
                res.status(500).send('Erreur lors de la suppression du message flaggé');
              } else {
                res.status(200).send('Message supprimé avec succès');
              }
            });
          }
        });
      });
      

    return router;
};