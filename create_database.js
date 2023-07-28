// var mysql = require('mysql2');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Motdepasse17"
// });

// // database creation

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE db_project7", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

// const fs = require('fs');
// const mysql = require('mysql2');
// const http = require('http');

// const dbConfig = {
//   host: "localhost",
//   user: "root",
//   password: "Neraph1902",
//   database: "db_project7"
// };
// // Créer une connexion à la base de données
// const con = mysql.createConnection(dbConfig);

// // Fonction pour exécuter une requête SQL
// function executeQuery(query) {
//   return new Promise((resolve, reject) => {
//     con.query(query, (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// }

// // Fonction pour insérer un objet dans la table "users"
// async function insertUser(user) {
//   const { name, phone, email, profil, status, password } = user;

//   const query = `INSERT INTO users (name, phone, email, profil, status, password) VALUES ('${name}', '${phone}', '${email}', '${profil}', '${status}', '${password}')`;
//   await executeQuery(query);
// }

// // Récupération des données depuis le fichier JSON et insertion dans la table "users"
// async function insertUsersData() {
//   try {
//     // Lire le fichier JSON
//     const filePath = 'json_database\users.json';
//     fs.readFile(filePath, 'utf-8', async (error, jsonData) => {
//       if (error) {
//         console.error('Erreur lors de la lecture du fichier JSON:', error);
//         return;
//       }

//       const usersArray = JSON.parse(jsonData);

      

//       // Créer la table "users" si elle n'existe pas déjà
//       await executeQuery(`
//         CREATE TABLE IF NOT EXISTS users (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           name VARCHAR(255),
//           phone VARCHAR(15),
//           email VARCHAR(255),
//           profil VARCHAR(255),
//           status VARCHAR(50),
//           password VARCHAR(255)
//         )
//       `);

//       // Insérer les données dans la table "users"
//       for (const user of usersArray) {
//         await insertUser(user);
//       }

//       // Fermer la connexion à la base de données
//       con.end();
//       console.log('Données des utilisateurs insérées avec succès dans la table "users".');
//     });
//   } catch (error) {
//     console.error('Une erreur s\'est produite :', error);
//   }
// }

// // Appeler la fonction pour insérer les données des utilisateurs
// insertUsersData();

// // ...

// // Fonction pour insérer un objet dans la table "messages"
// async function insertMessage(message) {
//   const { id, sender, receiver, text, date, hour, image, read, group } = message;

//   const query = `INSERT INTO messages (id, sender, receiver, text, date, hour, image, read, group) 
//                  VALUES ('${id}', '${sender}', '${receiver}', '${text}', '${date}', '${hour}', '${image}', '${read}', '${group}')`;
//   await executeQuery(query);
// }

// // Récupération des données depuis le fichier JSON et insertion dans la table "messages"
// async function insertMessagesData() {
//   try {
//     // Lire le fichier JSON
//     const filePath = 'json_database\messages.json';
//     fs.readFile(filePath, 'utf-8', async (error, jsonData) => {
//       if (error) {
//         console.error('Erreur lors de la lecture du fichier JSON:', error);
//         return;
//       }

//       const messagesArray = JSON.parse(jsonData);

//       // Créer la table "messages" si elle n'existe pas déjà
//       await executeQuery(`
//         CREATE TABLE IF NOT EXISTS messages (
//           id INT PRIMARY KEY,
//           sender VARCHAR(10),
//           receiver VARCHAR(10),
//           text TEXT,
//           date DATE,
//           hour TIME,
//           image VARCHAR(255),
//           read VARCHAR(5),
//           group VARCHAR(5)
//         )
//       `);

//       // Insérer les données dans la table "messages"
//       for (const message of messagesArray) {
//         await insertMessage(message);
//       }

//       // Fermer la connexion à la base de données
//       con.end();
//       console.log('Données des messages insérées avec succès dans la table "messages".');
//     });
//   } catch (error) {
//     console.error('Une erreur s\'est produite :', error);
//   }
// }

// // Appeler la fonction pour insérer les données des messages
// insertMessagesData();



const fs = require('fs');
const mysql = require('mysql2');
const http = require('http');

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Motdepasse17",
  database: "db_project7"
};

// Create a connection to the database
const con = mysql.createConnection(dbConfig);

// Function to execute an SQL query
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    con.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Function to create the "users" table and insert data from "users.json"
async function createUsersTableAndInsertData() {
  try {
    // Read the "users.json" file
    const usersFilePath = 'json_database\\users.json';
    const usersData = fs.readFileSync(usersFilePath, 'utf-8');
    const usersArray = JSON.parse(usersData);

    // Create the "users" table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(15),
        email VARCHAR(255),
        profil VARCHAR(255),
        status VARCHAR(50),
        password VARCHAR(255)
      )
    `);

    // Insert data into the "users" table
    for (const user of usersArray) {
      const { id, name, phone, email, profil, status, password } = user;
      await executeQuery(`
        INSERT INTO users (id, name, phone, email, profil, status, password)
        VALUES (${id}, '${name}', '${phone}', '${email}', '${profil}', '${status}', '${password}')
      `);
    }

    console.log('Users data inserted successfully.');
  } catch (error) {
    console.error('An error occurred while creating "users" table or inserting data:', error);
  }
}

// Function to create the "messages" table and insert data from "messages.json"
async function createMessagesTableAndInsertData() {
  try {
    // Read the "messages.json" file
    const messagesFilePath = 'json_database\\messages.json';
    const messagesData = fs.readFileSync(messagesFilePath, 'utf-8');
    const messagesArray = JSON.parse(messagesData);

    // Create the "messages" table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender VARCHAR(10),
        receiver VARCHAR(10),
        text TEXT,
        date DATE,
        hour TIME,
        image VARCHAR(255),
        isItRead BOOLEAN,
        isItGroup BOOLEAN
      )
    `);

    // Insert data into the "messages" table
    for (const message of messagesArray) {
      const { id, sender, receiver, text, date, hour, image, isItRead, isItGroup } = message;
      await executeQuery(`
        INSERT INTO messages (id, sender, receiver, text, date, hour, image, isItRead, isItGroup)
        VALUES (${id}, '${sender}', '${receiver}', '${text}', '${date}', '${hour}', '${image}', '${isItRead}', '${isItGroup}')
      `);
    }

    console.log('Messages data inserted successfully.');
  } catch (error) {
    console.error('An error occurred while creating "messages" table or inserting data:', error);
  }
}

// // HTTP server setup
// const server = http.createServer((req, res) => {
//   // Handle incoming requests (if needed)
// });

// Start the HTTP server and perform database operations
// server.listen(3000, () => {
//   console.log('Server started on port 3000.');

  // Call the functions to create tables and insert data
createUsersTableAndInsertData();
createMessagesTableAndInsertData();
// });
