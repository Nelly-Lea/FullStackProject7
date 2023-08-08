import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate,Navigate  } from "react-router-dom";
import {useParams } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import NoPage from "./NoPage";
import NewGroup from "./NewGroup";
import Admin from "./Admin";
import ContactProfil from "./ContactProfil";
import YourProfil from './YourProfil';
import GroupProfil from './GroupProfil';
// import './Style.css';


export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/:phone" element={<Home/>} />
             <Route path="contact_profil/:id" element={<ContactProfil/>}/>
             <Route path="group_profil/:id" element={<GroupProfil/>}/>
            <Route path="your_profil" element={<YourProfil/>}/>
            <Route path="new_group" element={<NewGroup/>} />
            <Route path="/admin" element={<Admin/>} />
            
            <Route path="*" element={<NoPage />} />

        </Routes>

    </BrowserRouter>
  );
}





