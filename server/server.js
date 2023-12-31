const https = require('https');
const mysql = require('mysql2');
const express = require('express')
const app = express()
app.use(express.json());
//const cors = require('cors');
//app.use(express.static('my-react-app'));

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project7"
});

// Établir la connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à la base de données réussie!');
  }
});


// const usersRouter = require('./users'); // Import the users.js file
const usersRouter = require('./users')(connection);
//console.log(usersRouter);
const messagesRouter = require('./messages')(connection); // Import the messages.js file
 const chat_groupsRouter = require('./chat_groups')(connection); // Import the groups.js file
 const flaggedMsgRouter = require('./flagged_msg.js')(connection); // Import the flagged_msg.js file
//  const imagesRouter = require('./images.js')(connection); // Import the flagged_msg.js file


app.use('/users', usersRouter); // Set route for users
app.use('/messages', messagesRouter); // Set route for messages
 app.use('/chat_groups', chat_groupsRouter); // Set route for groups
 app.use('/flagged_msg', flaggedMsgRouter); // Set route for flagged_msg
//  app.use('/images', imagesRouter); // Set route for flagged_msg


// Démarrer le serveur sur le port souhaité
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
