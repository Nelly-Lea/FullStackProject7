import React from "react"
import { useNavigate } from "react-router-dom"

import { useState ,useEffect } from "react";

//import ReactDOM from "react-dom/client";

// regex to match numbers between 1 and 10 digits long
// const validPassword = /^\d{1,10}$/;

export default function Register() {

  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  

const handleChange = ({target}) => {
    let isValid=true;
    const {name,value} = target;

    // if (name ==='password'){
    //     isValid=  validPassword.test(value);
    // }
    // if (isValid) {
    setInputs(values => ({...values, [name]: value}))
    // }

}


//submit
const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputs);
  
    const data = JSON.stringify(inputs);
    console.log(data);
    console.log(inputs);
  
    try {
      const response = await fetch(`users/${inputs.username}`, {
        method: "POST",
        body: data, // Envoyer les données telles quelles (déjà au format JSON)
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log(`Status: ${response.status}`);
      console.log("Response headers:", response.headers);
  
  
      if (response.status === 201) {

        alert("Welcome! You were registered successfully.");
    
        navigate('/login');
      } else {
        console.error(`Request failed with status code ${response.status}`);
        alert("Username is already in use");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  
  const profilePictureOptions = [
    {
      value: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      label: 'Première photo',
    },
    {
      value: 'https://i.pinimg.com/564x/26/ea/62/26ea622c0a0260942f7830db79d3a82a.jpg',
      label: 'Deuxième photo',
    },
    {
      value: 'https://img.freepik.com/photos-gratuite/vue-verticale-du-celebre-rocher-plage-santa-giulia_268835-3741.jpg?w=2000',
      label: 'Troisième photo',
    },
  ];

  return (
    <div className="login-container">
      <h1>WELCOME</h1>
      <form onSubmit={handleSubmit} className="login-form">
      <input
            id="nameInput"
            className="inputTypeIn"
            type="text" 
            name="name" 
            value={inputs.name || ""} 
            onChange={handleChange}
            placeholder="Enter your name:"
          required
        />
          <input
            id="passwordInput"
            className="inputTypeIn"
            // maxLength={4} 
            type="password" 
            name="password" 
          value={inputs.password || ""} 
            onChange={handleChange}
            placeholder="Enter your password:"
          required
        />
        <input
            id="phoneInput"
            className="inputTypeIn"
            type="tel" 
            name="phone" 
            value={inputs.phone || ""} 
            onChange={handleChange}
            placeholder="Enter your phone:"
            pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
          required
        />
        <input
            id="emailInput"
            className="inputTypeIn"
            type="email" 
            name="email" 
            value={inputs.email || ""} 
            onChange={handleChange}
            placeholder="Enter your email:"
          required
        />
        
        <div className="profile-picture-container">
          {profilePictureOptions.map((option) => (
            <label key={option.value} className="profile-picture-option">
              <input
                type="radio"
                name="profilePictureOption"
                value={option.value}
                checked={inputs.profilePictureOption === option.value}
                onChange={handleChange}
                required
              />
              <img src={option.value} alt={option.label} className="profile-picture-img" style={{ width: '100px', height: '100px' }} />
            </label>
          ))}
        </div>

        <input id="registerButton" type="submit" name="submit" value="REGISTER" />
    </form>
    </div>
    
  )
}

//id, name, username, email, address, phone, website, company