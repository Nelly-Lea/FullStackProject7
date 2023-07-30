import React, { useState, useEffect } from "react";

export default function NewComment({ comment, onSave, onCancel ,isUpdate,postId}) {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [showWindow, setShowWindow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const currentUser = JSON.parse(localStorage["currentUser"]);

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
      
        
    const handleInputChange = (event) => {
    // const { name, value } = event.target;
    // setFormData((prevData) => ({
    //     ...prevData,
    //     [name]: value
    // }));
    };
   
    const handleSubmit = async (event) => {
       
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
              {messages.map((user) => (
              <li key={user.id}>
                <p>{user.name}</p>
              </li>
            ))}
            </div>
          )}
        </div>
      );
    }
      
  
  