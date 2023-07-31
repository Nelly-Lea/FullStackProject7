import React, { useState, useEffect } from "react";
import "./styles.css";
//import fetch from 'node-fetch'; // Importez la bibliothèque fetch ou utilisez une autre bibliothèque de requêtes HTTP

//import readedImage from "./images/readed1.jpg";
export default function NewComment({ comment, onSave, onCancel ,isUpdate,postId}) {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [showWindow, setShowWindow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const currentUser = JSON.parse(localStorage["currentUser"]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState("");

    
    //console.log("imggg", readedImage)

    const handleUserClick = async (user) => {
        setSelectedUser(user);
      
        try {
          const response = await fetch(
            `/messages/messagesWithCurrentUser?currentId=${currentUser.id}&selectedUserId=${user.id}`
          );
          console.log(`Status: ${response.status}`);
          console.log('Response headers:', response.headers);
      
          if (response.ok) {
            const messagesData = await response.json();
            console.log('Messages:', messagesData);
            setMessages(messagesData);
          } else {
            console.error(`Request failed with status code ${response.status}`);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      
        setShowWindow(true);
      };
      
        
      const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
      };

      const handleImageChange = (event) => {
        const selectedImg=event.target.files[0];
        const imageURL = URL.createObjectURL(selectedImg);
        setSelectedImage(imageURL); // a voir l'URL ne marche pas si on redemarre le client
       
      };
      // const handleImageChange = async (event) => {
      //   const selectedImg = event.target.files[0];
      //   const formData = new FormData();
      //   formData.append("image", selectedImg);
      
      //   try {
      //     // Envoyez l'image à PostImage en utilisant une requête POST
      //     const response = await fetch("https://postimage.org/api.php", {
      //       method: "POST",
      //       body: formData,
      //     });
      
      //     if (response.ok) {
      //       // Si la requête a réussi, récupérez la réponse JSON de PostImage
      //       const responseData = await response.json();
      
      //       // Récupérez le lien de l'image à partir de la réponse de PostImage
      //       const imageUrl = responseData.url;
      
      //       // Utilisez le lien de l'image dans votre application
      //       setSelectedImage(imageUrl);
      //     } else {
      //       console.error("Failed to upload the image to PostImage.");
      //     }
      //   } catch (error) {
      //     console.error("An error occurred while uploading the image:", error);
      //   }
      // };
 
      
      
    const handleSubmitNewMessage = async (event) => {
      event.preventDefault();
      console.log("lien de l'image", selectedImage)
      
      const actualDate=new Date();
      const hours = actualDate.getHours();
      const min = actualDate.getMinutes();
      const sec = actualDate.getSeconds();

      const year = actualDate.getFullYear();
      const month = String(actualDate.getMonth() + 1).padStart(2, '0');
      const day = String(actualDate.getDate()).padStart(2, '0');

// Former la date au format 'YYYY-MM-DD'

      // verifiy if the selectedUser is a group
      let Isgroup=false;
      if ("isItGroup" in selectedUser) {
        Isgroup=true}
      else{
        Isgroup=false;
      }

      


      // Create a new message object with the necessary data
      const newMessageData = {
        sender:currentUser.id,
        receiver:selectedUser.id,
        text: newMessage,
        date:`${year}-${month}-${day}`,
        hour:`${hours}:${min}:${sec}`,
        // image: selectedImage,
        isItRead:false,
        isItGroup:Isgroup
        // Add any other data needed for the server request
      };

      if (selectedImage) {
        newMessageData.image = selectedImage;
      }
      else{
        newMessageData.image="";
      }
    
      try {
        // Send a POST request to the server to add the new message
        const response = await fetch("/messages/addMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessageData),
        });
         console.log("response: msg ajoute", response)
        if (response.ok) {
          // If the server successfully added the message, update the messages list
          //const responseData = await response.json();
          const NewMsgId = await response.json();
          newMessageData["id"] = NewMsgId;
          setMessages([...messages, newMessageData]);
          // setMessages([...messages, responseData]);
          // Clear the new message and selected image after adding
          setNewMessage("");
          setSelectedImage("");
        } else {
          console.error("Failed to add the new message.");
        }
      } catch (error) {
        console.error("An error occurred while adding the new message:", error);
      }
    };
    

    const fetchUsers = async () => {
        try {
          const response = await fetch(`/users/AllUsers?currentUser=${encodeURIComponent(localStorage["currentUser"])}`); // Appeler la route GET que vous avez créée
          if (response.ok) {
            const usersData = await response.json();
            setUsers(usersData); // Mettre à jour la variable d'état 'users' avec les utilisateurs récupérés
        } else {
            console.error(`Request failed with status code ${response.status}`);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      };
      
      useEffect(() => {
        fetchUsers();
      }, []);
      
    
      return (
        <div>
          <h1>Contacts</h1>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <button onClick={() => handleUserClick(user)}>{user.name}</button>
              </li>
            ))}
          </ul>
    
          {/* Condition pour afficher la fenêtre vide */}
          {showWindow && (
            <div>
              {<p>{selectedUser.name}</p>}
              {messages.map((msg) => (
              <li key={msg.id}>
               {msg.text!==""?  <p>{msg.text}</p>: '' }
               {msg.image!==""?  <img src={msg.image} className="img_msg"></img>: ''}
               
               <p>{new Date(msg.date).toLocaleDateString()}</p>
               {/* <p>{msg.hour}</p> */}
               <p>{msg.hour.slice(0, 5)}:{msg.hour.slice(6).padStart(2, '0')}</p>
               {msg.isItRead==true? <img src="http://www.clipartbest.com/cliparts/dir/LB8/dirLB85i9.png" className="readed_img"></img>: <img src="https://clipart-library.com/new_gallery/7-71944_green-tick-transparent-transparent-tick.png" className="readed_img"></img>}
              </li>
            ))}
            {selectedUser && (
              <form onSubmit={handleSubmitNewMessage}>
                <textarea
                  value={newMessage}
                  onChange={handleNewMessageChange}
                  placeholder="Write a new message..."
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                  {/* Afficher l'image choisie */}
                  {selectedImage && (
                    <img src={selectedImage} alt="Selected Image" className="selected_image_newMsg" />
                  )}
                <button type="submit">Send</button>
              </form>
            )}
            </div>
          )}
        </div>
      );
    }
      
  
  