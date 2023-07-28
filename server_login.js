const https = require('https');
const mysql = require('mysql2');
const express = require('express')
const app = express()
const cors = require('cors');

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Motdepasse17",
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

app.use(express.json());

// Route GET pour récupérer les informations de l'utilisateur
app.get('/login_user', (req, res) => {
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

// Démarrer le serveur sur le port souhaité
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
