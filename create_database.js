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





const fs = require('fs');
const mysql = require('mysql2');

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

//Function to create the "users" table and insert data from "users.json"
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
        isItGroup BOOLEAN,
        modified BOOLEAN,
        flagged BOOLEAN,
        readedBy JSON

      )
    `);

    // Insert data into the "messages" table
    for (const message of messagesArray) {
      const { id, sender, receiver, text, date, hour, image, isItRead, isItGroup, modified, flagged, readedBy } = message;
      await executeQuery(`
        INSERT INTO messages (id, sender, receiver, text, date, hour, image, isItRead, isItGroup, modified, flagged, readedBy)
        VALUES (${id}, '${sender}', '${receiver}', '${text}', '${date}', '${hour}', '${image}', ${isItRead}, ${isItGroup}, ${modified}, ${flagged}, '${JSON.stringify(readedBy)}')
      `);
    }
    console.log('Messages data inserted successfully.');
  } catch (error) {
    console.error('An error occurred while creating "messages" table or inserting data:', error);
  }
}

// Function to create the "chat_groups" table and insert data from "groups.json"
async function createChatGroupsTableAndInsertData() {
  try {
    // Read the "groups.json" file
    const groupsFilePath = 'json_database\\groups.json';
    const groupsData = fs.readFileSync(groupsFilePath, 'utf-8');
    const groupsArray = JSON.parse(groupsData);

    // Create the "chat_groups" table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS chat_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        adminId INT,
        participantsId JSON,
        title VARCHAR(255),
        profil VARCHAR(255),
        description TEXT
      )
    `);

    // Insert data into the "chat_groups" table
    for (const group of groupsArray) {
      const { id, adminId, participantsId, title, profil, description } = group;
      await executeQuery(`
        INSERT INTO chat_groups (id, adminId, participantsId, title, profil, description)
        VALUES (${id}, ${adminId}, '${JSON.stringify(participantsId)}', '${title}', '${profil}', '${description}')
      `);
    }
    console.log('Chat groups data inserted successfully.');
  } catch (error) {
    console.error('An error occurred while creating "chat_groups" table or inserting data:', error);
  }
}

async function createFlaggedMsgTableAndInsertData() {
  try {
    // Read the "flagged_msg.json" file
    const flaggedMsgFilePath = 'json_database\\flagged_msg.json';
    const flaggedMsgData = fs.readFileSync(flaggedMsgFilePath, 'utf-8');
    const flaggedMsgArray = JSON.parse(flaggedMsgData);

    // Create the "flagged_msg" table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS flagged_msg (
        id INT AUTO_INCREMENT PRIMARY KEY,
        msgId INT,
        sender INT,
        receiver INT,
        text TEXT,
        date DATE,
        hour TIME,
        image VARCHAR(255),
        isItGroup BOOLEAN,
        checked BOOLEAN,
        deleted BOOLEAN
      )
    `);

    // Insert data into the "flagged_msg" table
    for (const flaggedMsg of flaggedMsgArray) {
      const { id,msgId, sender, receiver, text, date, hour, image, isItGroup, checked, deleted } = flaggedMsg;
      await executeQuery(`
        INSERT INTO flagged_msg (id,msgId, sender, receiver, text, date, hour, image, isItGroup, checked, deleted)
        VALUES (${id},${msgId},  ${sender}, ${receiver}, "${text}", "${date}", "${hour}", "${image}", ${isItGroup}, ${checked}, ${deleted})
      `);
    }
    console.log('Flagged messages data inserted successfully.');
  } catch (error) {
    console.error('An error occurred while creating "flagged_msg" table or inserting data:', error);
  }
}


//Call the functions to insert data into tables
createUsersTableAndInsertData();
createMessagesTableAndInsertData();
createChatGroupsTableAndInsertData();
createFlaggedMsgTableAndInsertData();
// async function createImagesTableAndInsertData() {
//   try {
//     // Read the "images.json" file
//     const imagesFilePath = 'json_database\\images.json';
//     const imagesData = fs.readFileSync(imagesFilePath, 'utf-8');
//     const imagesArray = JSON.parse(imagesData);

//     // Create the "images" table if it doesn't exist
//     await executeQuery(`
//       CREATE TABLE IF NOT EXISTS images (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         mime_type VARCHAR(50) NOT NULL,
//         data LONGBLOB NOT NULL
//       )
//     `);

//     // Insert data into the "images" table
//     for (const image of imagesArray) {
//       const { id, name, mime_type, data } = image;
//       await executeQuery(`
//         INSERT INTO images (id, name, mime_type, data)
//         VALUES (${id}, '${name}', '${mime_type}', '${data}')
//       `);
//     }

//     console.log('Images data inserted successfully.');
//   } catch (error) {
//     console.error('An error occurred while creating "images" table or inserting data:', error);
//   }
// }

// createImagesTableAndInsertData();