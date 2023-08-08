const https = require('https');
const mysql = require('mysql2');
const express = require('express')
const app = express()
console.log('chat_groups.js fichier')
const router = express.Router();
// Route GET pour récupérer les informations de l'utilisateur
module.exports = (connection) => {
   //This code defines a route handler for a POST request
router.post('/AddGroup', (req, res) => {
    // Handle POST request for creating a new chat_groups
   
     const newGroup = req.body; // Extract the newGroup object from the request body
     
     // Define the SQL query to insert the new todo into the 'chat_groups' table
     const query = 'INSERT INTO chat_groups SET ?';
   
     // Execute the SQL query with the newTodo object as a parameter
     connection.query(query, [newGroup], (err, results) => {
       if (err) {
         // If an error occurs during the query execution, log the error and send a response with an error message
         console.error('Error in request execution', err);
         res.status(500);  // Set the response status to 500 (Internal Server Error)
         return res.send({ error: 'An error occurred while retrieving chat_groups details.' });
       }
       // If the query execution is successful, send a response with a status code of 200 and the newTodo object
        res.status(200); // Set the response status to 200 (OK)
        res.send({ id: newGroup.id });
     });
   });


   // GET group infos
  router.get('/GroupInfo', (req, res) => {
    const groupId = req.query.GroupId;
    console.log(groupId)
   // Create an SQL query with a prepared parameter
   const query = 'SELECT * FROM chat_groups WHERE id = ?';
 
   // Execute the SQL query with the parameter
   connection.query(query, [groupId], (err, results) => {
     if (err) {
       console.error('Error in request execution', err);
       res.status(500); // Set the response status to 500 (Internal Server Error)
       return res.send({ error: 'An error occurred while retrieving group details.' });
     }
 
     
     // If the query executed successfully without any errors
     // Send the response with the details of the user
     const group = results[0]; 
     console.log("group infos",group);
     res.json(group); // Send the new user as a response
   });
 });


    return router;
}