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
        // const sender=req.body.sender;
        // const receiver=req.body.receiver;
        // const text=req.body.text;
        // const date=req.body.date;
        // const hour=req.body.hour;
        // const image=req.body.image;
        // const isItRead=req.body.isItRead;
        // const text=req.body.text;
        // Define the SQL query to insert the new msg into the 'messages' table
        const query = 'INSERT INTO messages SET ?';
       // const query1 = 'SELECT * FROM messages WHERE  (sender= ?) AND (receiver=?) AND (text=?) AND (date=?) AND hour=?) AND (image=?) AND (isItRead=?) AND (isItGroup=?)';
        //const query1='SELECT max(id) FROM messages'
        const query1 = 'SELECT * FROM messages WHERE id = ?';
        connection.query(query, [newMsg], (err, results) => {
          if (err) {
            // If an error occurs during the query execution, log the error and send a response with an error message
            console.error('Error in request execution', err);
            res.status(500); // Set the response status to 500 (Internal Server Error)
            return res.send({ error: 'An error occurred adding new message' });
          } else {
            const newMsgId = results.insertId; // Get the ID of the newly inserted message
        
            connection.query(query1, [newMsgId], (err, results1) => {
              if (err) {
                console.error('Error in request execution', err);
                res.status(500);
                return res.send({ error: 'An error occurred getting message' });
              }
        
              const newMessage = results1[0]; // Retrieve the newly inserted message details
              res.status(200).send(newMessage);
            });
          }
        });
      });

   // PUT a msg text => update msg
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

  router.put('/flagged', (req, res) => {

    // Extract the msgId and flagged from the request query parameters
    const msgId = req.query.id; 
   // const msgFlagged = req.query.flagged ; 
    const msgFlagged = req.query.flagged === 'true' ? 1 : 0;
    // Log the msgId and flagged to the console for debugging purposes
    console.log(msgId);
    console.log(msgFlagged);
  
   // Define the SQL query to update the flagged of the message item with the given msgId
    const query = `UPDATE messages SET flagged='${msgFlagged}' WHERE id = ?`;
  
    // Execute the SQL query with the msgId as a parameter
    connection.query(query, msgId, (error, results) => {
      if (error) {
        // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', error);
        res.status(500); // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'An error occurred while updating the flagged field.' });
      }
  
      // Check if the update query affected any rows in the database
      if (results.affectedRows === 0) {
        // If no rows were affected, send a response with an error message
        return res.send({ error: 'message not found' });
      }
  
      // If the update was successful, send a response with the updated title
      res.status(200); //Set the response status to 200 (OK)
      res.json(msgFlagged); 
    });
  });

  router.put('/modified', (req, res) => {

    // Extract the msgId and modified from the request query parameters
    const msgId = req.query.id; 
   
    const msgModified = req.query.modified === 'true' ? 1 : 0;
    // Log the msgId and modified to the console for debugging purposes
    console.log(msgId);
    console.log(msgModified);
  
   // Define the SQL query to update the flagged of the message item with the given msgId
    const query = `UPDATE messages SET modified='${msgModified}' WHERE id = ?`;
  
    // Execute the SQL query with the msgId as a parameter
    connection.query(query, msgId, (error, results) => {
      if (error) {
        // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', error);
        res.status(500); // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'An error occurred while updating the modified field.' });
      }
  
      // Check if the update query affected any rows in the database
      if (results.affectedRows === 0) {
        // If no rows were affected, send a response with an error message
        return res.send({ error: 'message not found' });
      }
  
      // If the update was successful, send a response with the updated title
      res.status(200); //Set the response status to 200 (OK)
      res.json(msgModified); 
    });
  });
  

  
  router.get('/getUnreadSenderIDs', (req, res) => {
      const currentUser = req.query.currentUserId; // Replace with the actual user ID
      // console.log(currentUser);
      const query = `SELECT DISTINCT sender FROM messages WHERE receiver = ? AND isItRead = 0`;
    
      connection.query(query, [currentUser], (error, results) => {
        if (error) {
          console.error('Error fetching unread sender IDs:', error);
          res.status(500).send('An error occurred.');
        } else {
          const senderIDs = results.map(result => parseInt(result.sender));
          // console.log("results" ,senderIDs);
          res.json(senderIDs);
        }
      });
    });

      
router.post('/markMessagesAsRead', (req, res) => {
  const currentUserId = req.body.currentUserId;
  const selectedUserId = req.body.selectedUserId;
  console.log(selectedUserId);
  connection.query(
      'UPDATE messages SET isItRead = 1 WHERE receiver = ? AND sender = ?',
      [currentUserId, selectedUserId],
      (err, updateResult) => {
          if (err) {
              console.error('Error updating messages:', err);
              res.status(500).send('Error updating messages');
          } else {
              console.log('Messages marked as read:', updateResult);
              res.status(200).send('Messages marked as read');
          }
      }
  );
});

  


  return router;
};

