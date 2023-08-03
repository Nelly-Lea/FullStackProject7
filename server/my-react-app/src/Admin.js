import React, { useState,useEffect  } from "react";
// import "./Admin.css";

export default function Admin() {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [users, setUsers] = useState([]);
  const [Flagged_msg, setFlagged_msg]=useState([]);
  const [Checked_msg, setChecked_msg] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchFlagged_msg();
    fetchChecked_msg();
  }, []);
      
 
  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
  };

   
  const handleUserClick = async (user) => {

  }

  const handleKeepClick = async (flagged_msg) => {
    try {
      const response = await fetch(`/flagged_msg/markMessageChecked/${flagged_msg.id}`, {
        method: 'POST',
      });
  
      if (response.ok) {
        setFlagged_msg(prevFlaggedMsg => prevFlaggedMsg.filter(msg => msg.id !== flagged_msg.id));
        setChecked_msg(prevCheckedMsg => [...prevCheckedMsg, flagged_msg]);

      } else {
        console.error(`Request failed with status code ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  
  const handleDeleteClick = async (flagged_msg) => {
  try {
    const response = await fetch(`/flagged_msg/deleteFlaggedMessage/${flagged_msg.id}`, {
      method: 'POST',
    });

    if (response.ok) {
        setFlagged_msg(prevFlaggedMsg => prevFlaggedMsg.filter(msg => msg.id !== flagged_msg.id));
        setChecked_msg(prevCheckedMsg => [...prevCheckedMsg, flagged_msg]);
    } else {
      console.error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};


  const Content1 = () => (
    <div>
        {users.map((user) => (
           
              <li key={user.id}>
                <button onClick={() => handleUserClick(user)}>{user.name}</button>
              </li>
            
          ))}
    </div>
  );

 
  const fetchUsers = async () => {
    console.log("fetchUsers");
    try {
      const response = await fetch(`/users/AllUsers`); // Appeler la route GET que vous avez créée
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

  const fetchFlagged_msg = async () => {
    try {
      const response = await fetch(`/flagged_msg/getAllFlagged_msg?checked=false`); // Appeler la route GET que vous avez créée
      if (response.ok) {
        const flagged_msgData = await response.json();
        setFlagged_msg(flagged_msgData); // Mettre à jour la variable d'état 'users' avec les utilisateurs récupérés
    } else {
        console.error(`Request failed with status code ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  const Content2 = () => (
    <div>
      {Flagged_msg.map((flagged_msg) => (
        <li key={flagged_msg.id}>
            <p>{flagged_msg.text}</p>
            <button onClick={() => handleKeepClick(flagged_msg)}>Keep</button>
            <button onClick={() => handleDeleteClick(flagged_msg)}>Delete</button>
        </li>
      ))}
    </div>
  );

  
  const fetchChecked_msg = async () => {
    try {
      const response = await fetch(`/flagged_msg/getAllChecked_msg?checked=true`); // Appeler la nouvelle route GET créée
      if (response.ok) {
        const checked_msgData = await response.json();
        setChecked_msg(checked_msgData); // Mettre à jour l'état avec les messages vérifiés
      } else {
        console.error(`Request failed with status code ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  const Content3 = () => (
    <div>
      {Checked_msg.map((checked_msg) => (
        <li key={checked_msg.id}>
          <p>{checked_msg.text}</p>
        </li>
      ))}
    </div>
  );

  return (
    <div className="admin-container">
      <div className="menu">
        <button onClick={() => handleChoiceClick("contacts")}>contacts</button>
        <button onClick={() => handleChoiceClick("messages to check")}>messages to check</button>
        <button onClick={() => handleChoiceClick("keeped messages")}>keeped messages</button>
      </div>

      <div className="content">
        {selectedChoice === "contacts" && <Content1 />}
        {selectedChoice === "messages to check" && <Content2 />}
        {selectedChoice === "keeped messages" && <Content3 />}
      </div>
    </div>
  );
}
