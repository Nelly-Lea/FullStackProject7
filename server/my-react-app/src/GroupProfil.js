import React from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom";

import { useState ,useEffect } from "react";




export default function GroupProfil() {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const currentUser = JSON.parse(localStorage["currentUser"]);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchGroupInfos = async () => {
        try {
            const response = await fetch(`/chat_groups/GroupInfo?GroupId=${id}`); // Appeler la route GET que vous avez créée
            if (response.ok) {
              const groupData = await response.json();
              setSelectedGroup(groupData) // Mettre à jour la variable d'état 'users' avec les utilisateurs récupérés
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
    fetchGroupInfos();
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
          <p className="contact_info_title">Group information:</p>
          {selectedGroup != null ? (
            <div className="user_info_container">
              <div className="user_info">
                <div>
                  <img src={selectedGroup.profil} className="img_contact_display_info" alt="Group Profile" />
                </div>
                <div className="user_details">
                  <p className="info_user_txt">{selectedGroup.title}</p>
                  {/* <p className="info_user_txt">{selectedUser.phone}</p> */}
                </div>
              </div>
              <div className="user_status">
                <p className="info_title">Description</p>
                <p className="info_content">{selectedGroup.description}</p>
                <p>participants</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      </div>
      

    );
}