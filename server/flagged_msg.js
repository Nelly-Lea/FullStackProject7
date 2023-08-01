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

    return router;
}