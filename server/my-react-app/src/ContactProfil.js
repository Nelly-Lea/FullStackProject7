import React from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom";

import { useState ,useEffect } from "react";




export default function ContactProfil() {
    const [selectedUser, setSelectedUser] = useState(null);
    const currentUser = JSON.parse(localStorage["currentUser"]);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchContactInfos = async () => {
        try {
            const response = await fetch(`/users/UserInfo?UserId=${id}`); // Appeler la route GET que vous avez créée
            if (response.ok) {
              const usersData = await response.json();
              setSelectedUser(usersData) // Mettre à jour la variable d'état 'users' avec les utilisateurs récupérés
          } else {
              console.error(`Request failed with status code ${response.status}`);
            }
          } catch (error) {
            console.error('An error occurred:', error);
          }

    }

    const ReturnToHome = async () => {
      if(currentUser.name==="Admin"){
        navigate(`/admin`);
      }
      else{
        navigate(`/${currentUser.phone}`);
      }
    }
  
  useEffect(() => {
    fetchContactInfos();
  }, []);
    return(
        // <div className="contact_info_div">
        //     <p>Contact information:</p>
        //     {selectedUser!=null ?
        //     <div> 
        //     <div >
        //     <img src={selectedUser.profil} className="img_contact_display_info"></img>
        //     <p className="info_user_txt">{selectedUser.name}</p>
        //     <p className="info_user_txt">{selectedUser.phone}</p>
        // </div>
        // <div>
        //     <p>Info</p>
        //     <p>{selectedUser.status}</p>
        // </div>
        // </div>:null}
            
        // </div>
        <div>
           <img src="https://img.icons8.com/?size=512&id=6483&format=png" onClick={()=>ReturnToHome()} className="returnToHome"></img>
        <div className="main_content">
        <div className="contact_info_div">
          <p className="contact_info_title">Contact information:</p>
          {selectedUser != null ? (
            <div className="user_info_container">
              <div className="user_info">
                <div>
                  <img src={selectedUser.profil} className="img_contact_display_info" alt="User Profile" />
                </div>
                <div className="user_details">
                  <p className="info_user_txt">{selectedUser.name}</p>
                  <p className="info_user_txt">{selectedUser.phone}</p>
                </div>
              </div>
              <div className="user_status">
                <p className="info_title">Info</p>
                <p className="info_content">{selectedUser.status}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      </div>
      

    );
}