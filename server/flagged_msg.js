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

      router.get('/getAllFlaggedMsg', (req, res) => {
        // Faites une requête SQL pour récupérer tous les messages flaggés (checked = true)
        const query = `
          SELECT * FROM flagged_msg`;
        connection.query(query, (err, flaggedRows) => {
          if (err) {
            console.error('Erreur lors de l\'exécution de la requête:', err);
            res.status(500).send('Erreur lors de la récupération des messages flaggés');
          } else {
            console.log(flaggedRows);
            res.json(flaggedRows);
          }
        });
      });
      

      // router.get('/getAllFlaggedMsgByChecked', (req, res) => {
      //   const checkedValue = req.query.checked; // Récupérer la valeur de la query "checked"
        
      //   // Vérifier si la valeur de "checked" est 'true' ou 'false'
      //   if (checkedValue !== 'true' && checkedValue !== 'false') {
      //     return res.status(400).send('Invalid value for "checked" query parameter');
      //   }
      
      //   // Faites une requête SQL pour récupérer les messages flaggés en fonction de l'état de vérification
      //   const query = `
      //     SELECT * FROM flagged_msg WHERE checked = ${checkedValue === 'true' ? 1 : 0}
      //   `;
      
      //   connection.query(query, (err, flaggedRows) => {
      //     if (err) {
      //       console.error('Erreur lors de l\'exécution de la requête:', err);
      //       res.status(500).send('Erreur lors de la récupération des messages flaggés');
      //     } else {
      //       res.json(flaggedRows);
      //     }
      //   });
      // });
      
   

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
      
        // Mettez à jour le statut du message comme supprimé dans la table flagged_msg
        const updateFlaggedMsgQuery = 'UPDATE flagged_msg SET checked = true, deleted = true WHERE msgId = ?';
        connection.query(updateFlaggedMsgQuery, [messageId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Erreur lors de la mise à jour du message flaggé:', updateErr);
            res.status(500).send('Erreur lors de la mise à jour du message flaggé');
          } else {
            // Après avoir marqué le message comme supprimé dans flagged_msg, supprimez-le de la table messages
            const deleteMessageQuery = 'DELETE FROM messages WHERE id = ?';
            connection.query(deleteMessageQuery, [messageId], (deleteErr, deleteResult) => {
              if (deleteErr) {
                console.error('Erreur lors de la suppression du message de la table messages:', deleteErr);
                res.status(500).send('Erreur lors de la suppression du message de la table messages');
              } else {
                res.status(200).send('Message supprimé avec succès');
              }
            });
          }
        });
      });

    // DELETE flagged_msg
    router.delete('/id', (req, res) => {

        let msgId = req.query.id;  
        
        
        // Define the SQL query to delete a flagged_msg with the given id
        const query = `DELETE FROM flagged_msg  WHERE msgId = ?`;
      
        // Execute the SQL query with the msgId as a parameter
        connection.query(query, msgId, (error, results) => {
          if (error) {
            // If an error occurs during the query execution, log the error and send a response with an error message
            console.error('Error in request execution', error);
            res.status(500); // Set the response status to 500 (Internal Server Error)
            return res.send({ error: 'error occured while deleting flagged message' });
          }
      
          // Check if any rows were affected by the delete operation
          if (results.affectedRows === 0) {
            // If no rows were affected, send a response with an error message
            return res.send({ error: 'flagged message not found' });
          }
      
          // If a row was affected (flagged message deleted), send a response with the deleted todoId
          res.status(200); //Set the response status to 200 (OK)
          res.send(msgId); 
        });
      });  
      
    return router;
};