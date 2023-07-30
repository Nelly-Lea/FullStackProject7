import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate,Navigate  } from "react-router-dom";
import {useParams } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import NoPage from "./NoPage";

// import './Style.css';


export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/:phone" element={<Home/>} />
            
            <Route path="*" element={<NoPage />} />

        </Routes>

    </BrowserRouter>
  );
}





