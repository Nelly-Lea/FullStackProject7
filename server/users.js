const https = require('https');
const mysql = require('mysql2');
const express = require('express')
//const app = express()
console.log('user.js fichier')
const router = express.Router();
// Route GET pour récupérer les informations de l'utilisateur
module.exports = (connection) => {
  router.get('/user', (req, res) => {
      const phone = req.query.phone;
      const password = req.query.password;

      console.log(phone);
      console.log(password);

      // Requête SQL pour récupérer les informations de l'utilisateur avec l'ID correspondant
      connection.query('SELECT * FROM users WHERE phone = ? AND password = ?', [phone,password], (err, rows) => {
        if (err) {
          console.error('Erreur lors de l\'exécution de la requête:', err);
          res.status(500).send('Erreur lors de la récupération des informations de l\'utilisateur');
        } else {
          if (rows.length === 0) {
            res.status(404).send('Utilisateur non trouvé');
          } else {
            const user = rows[0]; // Première ligne de résultats
            const userInfo = {
              id: user.id,
              name: user.name,
              phone: user.phone,
              email: user.email,
              profil: user.profil,
              status: user.status,
              password: user.password
            };
            res.json(userInfo);
          }
        }
      });
    });

    router.post('/:username', (req, res) => {
      const user = req.body; // Récupérer les données de l'utilisateur depuis la requête
      console.log("user register");
      console.log(user);
    
      // Vérifier si le numéro de téléphone est déjà utilisé
      connection.query('SELECT * FROM users WHERE phone = ?', [user.phone], (err, rows) => {
        if (err) {
          console.error('Error while executing the query: ', err);
          res.status(500).send('Error checking phone');
        } else {
          if (rows.length > 0) {
            res.status(400).send('Phone number is already in use');
          } else {
            // Insérer l'utilisateur dans la base de données
            connection.query('INSERT INTO users (name, email, address, phone, status) VALUES (?, ?, ?, ?, ?)',
              [user.name, user.email, user.address, user.phone, user.status],
              (err, result) => {
                if (err) {
                  console.error('Error while inserting user into the database: ', err);
                  res.status(500).send('Error inserting user into the database');
                } else {
                  const userToAdd = {
                    id: result.insertId,
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    phone: user.phone,
                    status: user.status
                  };
                  res.json(userToAdd);
                }
              }
            );
          }
        }
      });
    });
    

  return router;
};

