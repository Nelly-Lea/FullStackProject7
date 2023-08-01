const https = require('https');
const mysql = require('mysql2');
const express = require('express')
const app = express()
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

    // return all message send in group
    router.get('/messagesWithCurrentGroup', (req, res) => {
        //console.log('messages.js fichier')

        const groupId  = req.query.groupId;
       // const selectedUserId  =req.query.selectedUserId;

        console.log(groupId);
        // Faites une requête SQL pour récupérer tous les utilisateurs sauf celui en ligne actuellement
        
            connection.query('SELECT * FROM messages WHERE (receiver=?) AND (isItGroup=true) ORDER BY date ASC, hour ASC;', [groupId], (err, rows) => {
                //if (err) {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête:', err);
            res.status(500).send('Erreur lors de la récupération des messages');
        } else {
            console.log(rows);
            res.json(rows);
        }
        });
    });

    //register
    router.post('/addMessage', (req, res) => {
        const newMsg = req.body; // Extract the new msg data from the request body
           
        // Define the SQL query to insert the new msg into the 'messages' table
        const query = 'INSERT INTO messages SET ?';
      
        connection.query(query, [newMsg], (err, results) => {
          if (err) {
            // If an error occurs during the query execution, log the error and send a response with an error message
            console.error('Error in request execution', err);
            res.status(500); // Set the response status to 500 (Internal Server Error)
            return res.send({ error: 'An error occurred adding new message' });
          } else {
            // Get the ID of the newly inserted message
            const newMsgId = results.id; // Use "id" instead of "insertId"
      
            res.status(200); // Set the response status to 200 (OK)
            res.send({ id: newMsgId }); // Return the new message's ID in the response
          }
        });
      });

   // PUT a msg => update msg
   router.put('/text', (req, res) => {

    // Extract the msgId and msgText from the request query parameters
    const msgId = req.query.id; 
    const msg=req.body;
    const msgText = msg.text ; 
    const date=msg.date;
    const hour=msg.hour;
   
    console.log(msgId);
    console.log(msgText);
  
   // Define the SQL query to update the text of the message item with the given msgId
    //const query = `UPDATE messages SET text='${msgText}' WHERE id = ?`;
    const query = `UPDATE messages SET text = ?, date = ?, hour = ? WHERE id = ?`;
    // Execute the SQL query with the todoId as a parameter
    connection.query(query, [msgText, date, hour, msgId], (error, results) => {
      if (error) {
        // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', error);
        res.status(500); // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'An error occurred while updating the text field.' });
      }
  
      // Check if the update query affected any rows in the database
      if (results.affectedRows === 0) {
        // If no rows were affected, send a response with an error message
        return res.send({ error: 'message not found' });
      }
  
      // If the update was successful, send a response with the updated title
      res.status(200); //Set the response status to 200 (OK)
      res.send(msgText); 
    });
  });


  //DELETE a message
  router.delete('/id', (req, res) => {

    let msgId = req.query.id;  
    
    
    // Define the SQL query to delete a todo with the given id
    const query = `DELETE FROM messages  WHERE id = ?`;
  
    // Execute the SQL query with the msgId as a parameter
    connection.query(query, msgId, (error, results) => {
      if (error) {
        // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', error);
        res.status(500); // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'error occured while deleting message' });
      }
  
      // Check if any rows were affected by the delete operation
      if (results.affectedRows === 0) {
        // If no rows were affected, send a response with an error message
        return res.send({ error: 'message not found' });
      }
  
      // If a row was affected (todo deleted), send a response with the deleted todoId
      res.status(200); //Set the response status to 200 (OK)
      res.send(msgId); 
    });
  });
  
      
    
  


  return router;
};

