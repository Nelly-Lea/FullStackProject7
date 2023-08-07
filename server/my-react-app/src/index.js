
// import React from 'react';
// import ReactDOM from 'react-dom';
// import Router from './Router';

// ReactDOM.render(<Router />, document.getElementById('root'));
import React from "react";
import ReactDOM from "react-dom/client";
//import "./css/index.css";
import Router from './Router';
import { CookiesProvider } from "react-cookie";

// for react context

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render( <CookiesProvider><Router /></CookiesProvider>
    
);