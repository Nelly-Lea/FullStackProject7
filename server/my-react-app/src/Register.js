import React from "react"
import { useNavigate } from "react-router-dom"

import { useState ,useEffect } from "react";

//import ReactDOM from "react-dom/client";

// regex to match numbers between 1 and 10 digits long
const validPassword = /^\d{1,10}$/;

export default function Register() {

  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  

const handleChange = ({target}) => {
    let isValid=true;
    const {name,value} = target;

    if (name ==='password'){
        isValid=  validPassword.test(value);
    }
    if (isValid) {
        setInputs(values => ({...values, [name]: value}))
    }

}


//submit
const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputs);
  
    const data = JSON.stringify(inputs);
    console.log(data);
    console.log(inputs);
  
    try {
      const response = await fetch(`http://localhost:3000/${inputs.username}/users`, {
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
  
 

  return (
    <div className="login-container">
      <h1>WELCOME</h1>
      <form onSubmit={handleSubmit} className="login-form">
          <input 
            className="inputTypeIn"
            id="userNameInput"
            type="text" 
            name="username" 
            value={inputs.username || ""} 
            onChange={handleChange}
            placeholder="Enter your name:"
            required
          />
          <input
            id="passwordInput"
            className="inputTypeIn"
            maxLength={4} 
            type="password" 
            name="password" 
          value={inputs.password || ""} 
            onChange={handleChange}
            placeholder="Enter your password:"
          required
        />
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
            id="emailInput"
            className="inputTypeIn"
            type="email" 
            name="email" 
            value={inputs.email || ""} 
            onChange={handleChange}
            placeholder="Enter your email:"
          required
        />
        <input
            id="addressInput"
            className="inputTypeIn"
            type="text" 
            name="address" 
            value={inputs.address || ""} 
            onChange={handleChange}
            placeholder="Enter your address:"
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
            id="websiteInput"
            className="inputTypeIn"
            type="text" 
            name="website" 
            value={inputs.website || ""} 
            onChange={handleChange}
            placeholder="Enter your website:"
          required
        />
        <input
            id="companyInput"
            className="inputTypeIn"
            type="text" 
            name="company" 
            value={inputs.company || ""} 
            onChange={handleChange}
            placeholder="Enter your company:"
          required
        />
        <input id="registerButton" type="submit" name="submit" value="REGISTER" />
    </form>
    </div>
    
  )
}

//id, name, username, email, address, phone, website, company