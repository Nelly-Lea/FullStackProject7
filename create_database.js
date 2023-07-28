//var mysql = require('mysql2');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Neraph1902"
// });

//database creation

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE db_project7", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

const fs = require('fs');
const mysql = require('mysql2');
const http = require('http');

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Neraph1902",
  database: "db_project7"
};
// Créer une connexion à la base de données
const con = mysql.createConnection(dbConfig);

// Fonction pour exécuter une requête SQL
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

// Fonction pour insérer un objet dans la table "users"
async function insertUser(user) {
  const { name, phone, email, profil, status, password } = user;

  const query = `INSERT INTO users (name, phone, email, profil, status, password) VALUES ('${name}', '${phone}', '${email}', '${profil}', '${status}', '${password}')`;
  await executeQuery(query);
}

// Récupération des données depuis le fichier JSON et insertion dans la table "users"
async function insertUsersData() {
  try {
    // Lire le fichier JSON
    const filePath = 'C:\\Users\\nelly\\Documents\\Full Stack\\Project 7\\FullStackProject7\\json_database\\users.json';
    fs.readFile(filePath, 'utf-8', async (error, jsonData) => {
      if (error) {
        console.error('Erreur lors de la lecture du fichier JSON:', error);
        return;
      }

      const usersArray = JSON.parse(jsonData);

      

      // Créer la table "users" si elle n'existe pas déjà
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

      // Insérer les données dans la table "users"
      for (const user of usersArray) {
        await insertUser(user);
      }

      // Fermer la connexion à la base de données
      con.end();
      console.log('Données des utilisateurs insérées avec succès dans la table "users".');
    });
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}

// Appeler la fonction pour insérer les données des utilisateurs
insertUsersData();
