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
    const [DisplayMenu, setDisplayMenu] = useState(false);
    const [SelectedMessageId, setSelectedMessageId]=useState(null);
    const [FlaggedMessages, setFlaggedMessage] = useState([]);
    const [MessagesToEditId, setMessageToEditId] = useState(null);
    const [editedMessage, setEditedMessage] = useState("");
    
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
      const handleGroupClick = async (group) => {
        const groupId=group.id;
        setSelectedUser(group);
        try {
          const response = await fetch(
            `/messages/messagesWithCurrentGroup?groupId=${groupId}`
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
        //return null;
      }
        
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
      if ("adminId" in selectedUser) {
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
    const handleMessageClick= async(msgId)=>{
      setSelectedMessageId(msgId);
      setDisplayMenu(!DisplayMenu);
    }

    const handleDeleteMessage=async(msgId)=>{
      try {
        const response = await fetch(`/messages/id?id=${msgId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Request failed for deleting message");
        }
        const data = await response.json();
        console.log(data);
        setMessages((prevMsg) => {
          return prevMsg.filter((msg) => msg.id !== msgId);
        });
       
      } catch (error) {
        console.error("Error:", error);
      }
    }
    const handleEditMessage=async(msgId, msgText)=>{
      setEditedMessage(msgText);
      setMessageToEditId(msgId)
     
    }

  
    const handleSubmitEdit = async (event, msgId) => {
      event.preventDefault();
      const actualDate = new Date();
      const hours = actualDate.getHours();
      const min = actualDate.getMinutes();
      const sec = actualDate.getSeconds();
    
      const year = actualDate.getFullYear();
      const month = String(actualDate.getMonth() + 1).padStart(2, '0');
      const day = String(actualDate.getDate()).padStart(2, '0');
      const date = `${year}-${month}-${day}`;
      const hour = `${hours}:${min}:${sec}`;
      console.log("nouvelle heure:", hour)
    
      try {
        const requestData = {
          text: editedMessage,
          date: date,
          hour: hour,
        };
    
        // Send a PUT request to the server to update the message
        const response = await fetch(`/messages/text?id=${msgId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
    
       

    if (response.ok) {
      // Find the index of the message in the messages array
      const messageIndex = messages.findIndex((msg) => msg.id === msgId);

      if (messageIndex !== -1) {
        // Create a deep copy of the message at the found index
        const updatedMessage = JSON.parse(JSON.stringify(messages[messageIndex]));

        // Update the text, hour, and date fields of the copied message
        updatedMessage.text = editedMessage;
        updatedMessage.date = date;
        updatedMessage.hour = hour;
        console.log("msg modifie", updatedMessage)

        // Create a new array with the updated message at the found index
        const updatedMessages = [
          ...messages.slice(0, messageIndex),
          updatedMessage,
          ...messages.slice(messageIndex + 1),
        ];

        // Set the state with the updated messages array
        setMessages(updatedMessages);
      }
    } else {
      console.error("Failed to update message.");
    }
      } catch (error) {
        console.error("An error occurred while updating message:", error);
      }
    
      setEditedMessage("");
      setMessageToEditId(null);
    };
    
     
    const handleReportMessage=async(msgId)=>{
      const newFlaggedMessage = {
       msgId:msgId,
       checked:false
      };

      try {
        // Send a POST request to the server to add the new message
        const response = await fetch("/flagged_msg/addFlaggedMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newFlaggedMessage),
        });
         console.log("response: msg ajoute", response)
        if (response.ok) {
          // If the server successfully added the message, update the messages list
          //const responseData = await response.json();
          const NewFlaggedMsgId = await response.json();
          newFlaggedMessage["id"] = NewFlaggedMsgId;
          setFlaggedMessage([...FlaggedMessages,newFlaggedMessage]) // a voir si on en a besoin
         
        } else {
          console.error("Failed to add the new flagged message.");
        }
      } catch (error) {
        console.error("An error occurred while adding the new flagged message:", error);
      }
    }
      useEffect(() => {
        fetchUsers();
      }, []);
      
    
      return (
      <div className="container">
          <div className="left-div">
          <h1>Contacts</h1>
          {/* <ul>
            {users.map((user) => ({("phone" in user)? 
              <li key={user.id}>
                <button onClick={() => handleUserClick(user)}>{user.name}</button>
              </li>:<li key={user.id}> <button onClick={() => handleGroupClick(user)}>{user.title}</button></li> 
            ))}
          </ul>
     */}
          <ul>
          {users.map((user) => (
            "phone" in user ? (
              <li key={user.id}>
                <button onClick={() => handleUserClick(user)}>{user.name}</button>
              </li>
            ) : (
              <li key={user.id}>
                <button onClick={() => handleGroupClick(user)}>{user.title}</button>
              </li>
            )
          ))}
        </ul>
        </div>
         <div className="right-div speech-wrapper"> 
          {/* Condition pour afficher la fenêtre vide */}
          {showWindow && (
            <div>
              {<p>{selectedUser.name}</p>}
              {messages.map((msg) => (
        <li
          key={msg.id}
          className={`${msg.sender == currentUser.id ? "sender-right bubble alt" : "sender-left bubble"} msg_list `}
          onClick={() => handleMessageClick(msg.id)}
        >

           {/* Afficher le champ d'édition si le message est en cours d'édition */}
           {msg.id === MessagesToEditId ? (
            <form onSubmit={(event) => handleSubmitEdit(event, msg.id)}>
              <textarea
                value={editedMessage}
                onChange={(event) => setEditedMessage(event.target.value)}
              />
              <button type="submit">Save</button>
            </form>
          ) : (
            // Sinon, afficher le texte du message
            <>
          {msg.text !== "" ? <p>{msg.text}</p> : ""}
          {msg.image !== "" ? <img src={msg.image} className="img_msg" alt="Message image" /> : ""}
          <p>{new Date(msg.date).toLocaleDateString()}</p>
          {/* <p>{msg.hour.slice(0, 5)}:{msg.hour.slice(6).padStart(2, "0")}</p> */}
           <p>{msg.hour}</p>
          {msg.isItRead ? (
            <img src="http://www.clipartbest.com/cliparts/dir/LB8/dirLB85i9.png" className="readed_img" alt="Read" />
          ) : (
            <img src="https://clipart-library.com/new_gallery/7-71944_green-tick-transparent-transparent-tick.png" className="readed_img" alt="Not read" />
          )}
           {/* <div class="bubble-arrow"></div> */}
           <div className={`${msg.sender == currentUser.id ? "bubble-arrow alt" : "bubble-arrow"}`}></div>
          </>
          )}

          {/* Afficher le menu de boutons */}
          {DisplayMenu && SelectedMessageId === msg.id && (
            <div className="message-menu">
              <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
             { msg.sender==currentUser.id ? <button onClick={() => handleEditMessage(msg.id, msg.text)}>Modify</button>:null}
             { msg.sender==selectedUser.id ? <button onClick={() => handleReportMessage(msg.id)}>Report</button>:null}
            </div>
          )}
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
    </div>
      );
    }
      
  
  