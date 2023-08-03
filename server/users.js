const https = require('https');
const mysql = require('mysql2');
const express = require('express')
//const app = express()
console.log('user.js fichier')
const router = express.Router();
// Route GET pour récupérer les informations de l'utilisateur
module.exports = (connection) => {
  //login
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

    //register
    router.post('/registerUser', (req, res) => {
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
            console.log("rows",rows);
            res.status(400).send('Phone number is already in use');
          } else {
            // Insérer l'utilisateur dans la base de données
            connection.query('INSERT INTO users (name, phone, email, profil, status, password) VALUES (?, ?, ?, ?, ?, ?)',
              [user.name, user.phone, user.email, user.profilePictureOption, user.status, user.password],
              (err, result) => {
                if (err) {
                  console.error('Error while inserting user into the database: ', err);
                  res.status(500).send('Error inserting user into the database');
                } else {
                  const userToAdd = {
                    id: result.insertId,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profil:user.profilePictureOption,
                    status: user.status,
                    password:user.password
                  };
                  res.json(userToAdd);
                }
              }
            );
          }
        }
      });
    });
    
//   // Route GET pour récupérer tous les utilisateurs sauf celui en ligne actuellement
//   router.get('/AllUsers', (req, res) => {
//     const userData  = JSON.parse(req.query.currentUser);
//     console.log(userData);
//     // Faites une requête SQL pour récupérer tous les utilisateurs sauf celui en ligne actuellement
//     connection.query('SELECT * FROM users WHERE id != ? && name != "Admin"', [userData.id], (err, rows) => {
//       if (err) {
//         console.error('Erreur lors de l\'exécution de la requête:', err);
//         res.status(500).send('Erreur lors de la récupération des utilisateurs');
//       } else {
//         console.log(rows);
//         res.json(rows);
//       }
//     });
// });

// Route GET pour récupérer tous les utilisateurs et les groupes sauf celui en ligne actuellement
router.get('/AllUsersAndGroups', (req, res) => {
  const userData = JSON.parse(req.query.currentUser);
  console.log(userData);

  // Faites une requête SQL pour récupérer tous les utilisateurs sauf celui en ligne actuellement
  connection.query('SELECT * FROM users WHERE id != ? && name != "Admin"', [userData.id], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête:', err);
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
    } else {
      console.log(rows);

      // Récupérer les groupes depuis la base de données qui contiennent l'id du currentUser dans la liste des participantsId
      connection.query('SELECT * FROM chat_groups WHERE JSON_CONTAINS(participantsId, ?)', [JSON.stringify(userData.id)], (err, groupRows) => {
        if (err) {
          console.error('Erreur lors de l\'exécution de la requête:', err);
          res.status(500).send('Erreur lors de la récupération des groupes');
        } else {
          console.log(groupRows);

          // Concaténer la liste filtrée des groupes avec la liste des utilisateurs récupérés depuis la base de données
          const combinedData = [...rows, ...groupRows];

          res.json(combinedData);
        }
      });
    }
  });
});

router.get('/AllUsers', (req, res) => {
  const userData = JSON.parse(req.query.currentUser);
  console.log(userData);

  // Faites une requête SQL pour récupérer tous les utilisateurs sauf celui en ligne actuellement
  connection.query('SELECT * FROM users WHERE id != ? && name != "Admin"', [userData.id], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête:', err);
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
    } else {
      //console.log(rows);
      res.json(rows);
      
      
    }
  });
});




  return router;
};

bonsoir;