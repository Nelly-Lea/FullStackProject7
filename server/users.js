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
  // console.log(userData);

  // Faites une requête SQL pour récupérer tous les utilisateurs sauf celui en ligne actuellement
  connection.query('SELECT * FROM users WHERE id != ? && name != "Admin"', [userData.id], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête:', err);
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
    } else {
      // console.log(rows);

      // Récupérer les groupes depuis la base de données qui contiennent l'id du currentUser dans la liste des participantsId
      connection.query('SELECT * FROM chat_groups WHERE JSON_CONTAINS(participantsId, ?)', [JSON.stringify(userData.id)], (err, groupRows) => {
        if (err) {
          console.error('Erreur lors de l\'exécution de la requête:', err);
          res.status(500).send('Erreur lors de la récupération des groupes');
        } else {
          // console.log(groupRows);

          // Concaténer la liste filtrée des groupes avec la liste des utilisateurs récupérés depuis la base de données
          const combinedData = [...rows, ...groupRows];

          res.json(combinedData);
        }
      });
    }
  });
});


// Route pour récupérer tous les utilisateurs sauf celui en ligne actuellement avec l'utilisateur actuel
router.get('/AllUsersWithCurrentUser', (req, res) => {
  const userData = JSON.parse(req.query.currentUser);

  connection.query('SELECT * FROM users WHERE id != ? AND name != "Admin"', [userData.id], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête:', err);
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
    } else {
      res.json(rows);
    }
  });
});

  
  router.get('/AllUsers', (req, res) => {
    // const userData = JSON.parse(req.query.currentUser);
    // console.log(userData);

    // Faites une requête SQL pour récupérer tous les utilisateurs sauf celui en ligne actuellement
    connection.query('SELECT * FROM users WHERE name != "Admin"', (err, rows) => {
      if (err) {
        console.error('Erreur lors de l\'exécution de la requête:', err);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
      } else {
        // console.log(rows);
        res.json(rows);
        
      }
    });
  });


  //GET user according user id
  router.get('/UserInfo', (req, res) => {
    const userId = req.query.UserId;
    console.log(userId)
   // Create an SQL query with a prepared parameter
   const query = 'SELECT * FROM users WHERE id = ?';
 
   // Execute the SQL query with the parameter
   connection.query(query, [userId], (err, results) => {
     if (err) {
       console.error('Error in request execution', err);
       res.status(500); // Set the response status to 500 (Internal Server Error)
       return res.send({ error: 'An error occurred while retrieving user details.' });
     }
 
     
     // If the query executed successfully without any errors
     // Send the response with the details of the user
     const user = results[0]; 
     console.log("user infos",user);
     res.json(user); // Send the new user as a response
   });
 });

 // GET som id and name accodring list of id
  //GET user according user id
  // router.get('/UserInfoAccordingIdArray', (req, res) => {
  //   try {
  //     const userIdsJSON = req.query.userIdArray; // Chaîne JSON encodée
  //     const userIdArray = JSON.parse(decodeURIComponent(userIdsJSON)); // Convertir en tableau
  
  //     const placeholders = userIdArray.map(() => '?').join(', ');
  
  //     const query = `
  //       SELECT id, name
  //       FROM users
  //       WHERE id IN (${placeholders})
  //     `;
  
  //     connection.query(query, userIdArray, (err, results) => {
  //       if (err) {
  //         console.error('Error in request execution', err);
  //         res.status(500);
  //         return res.send({ error: 'An error occurred while retrieving user details.' });
  //       }
  
  //       console.log("user name and id array", results);
  //       res.json(results);
  //     });
  //   } catch (error) {
  //     console.error('An error occurred:', error);
  //     res.status(400); // Mauvaise requête
  //     return res.send({ error: 'Invalid user ID array.' });
  //   }
  // });
  




//   router.get('/UserInfoAccordingIdArray', (req, res) => {
//     const userIds = req.query.userIdArray;
//     console.log(userIds)
//     const placeholders = userIds.map(id => parseInt(id));
//     //const placeholders = userIds.map(() => '?').join(', ');

//     // Requête SQL avec la clause IN dynamique
//     const query = `
//       SELECT id, name
//       FROM users
//       WHERE id IN (${placeholders})
//     `;
 
//    // Execute the SQL query with the parameter
//    connection.query(query, [userIds], (err, results) => {
//      if (err) {
//        console.error('Error in request execution', err);
//        res.status(500); // Set the response status to 500 (Internal Server Error)
//        return res.send({ error: 'An error occurred while retrieving user details.' });
//      }
 
     
//      // If the query executed successfully without any errors
//      // Send the response with the details of the user
//      //const user = results[0]; 
//      console.log("user name and id array",results);
//      res.json(results); // Send the new user as a response
//    });
//  });

// Updating user profil PUT
 router.put('/profil', (req, res) => {


  const userId = req.query.id; 
 
  const userName = req.query.name;
  const userStatus = req.query.status;
  const userPassword = req.query.password;
  const userEmail = req.query.email;
  const userProfil = req.query.profil;
 

 
  const query = `UPDATE users SET name = ?, email = ?, profil = ?, status = ?, password = ? WHERE id = ?`;

  // Execute the SQL query with the msgId as a parameter
  connection.query(query, [userName,userEmail,userProfil,userStatus,userPassword,userId ], (error, results) => {
    if (error) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', error);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while updating the user field.' });
    }

    // Check if the update query affected any rows in the database
    if (results.affectedRows === 0) {
      
      return res.send({ error: 'user not found' });
    }

    // If the update was successful, send a response with the updated title
    res.status(200); //Set the response status to 200 (OK)
    res.json(userId); 
  });
});

router.get('/ParticipantsInfo', (req, res) => {
  const groupId = req.query.GroupId;

 

  // Create an SQL query with a prepared parameter
  const query = 'SELECT participantsId FROM chat_groups WHERE id = ?';

 

  // Execute the SQL query with the parameter
  connection.query(query, [groupId], (err, results) => {
    if (err) {
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving participants information.' });
    }

 

    // If the query executed successfully without any errors
    // Get the participantsId array from the result
    const group = results[0];
    const participantsIdArray = JSON.parse(group.participantsId); // Parse the stringified JSON array
    const participantsIdIntegers = participantsIdArray.map(id => parseInt(id)); // Convert each element to an integer

    console.log("participantsId as integers:", participantsIdIntegers);
    res.json({ participantsId: participantsIdIntegers }); // Send the participantsId as an array of integers
  });
});


  return router;
};

