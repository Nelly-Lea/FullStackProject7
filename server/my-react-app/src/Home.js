import React from "react";
import { Link } from "react-router-dom";
import Login from "./Login";

export default function Home() {
  return (
    <>
      <header className="home-container">
        <nav>
          <ul className="homeDiv">
            <h1 style={{ fontSize: "70px", textAlign: "center" }}>WELCOME</h1>
            <li className="center-link">
              <Link className="loginLink" to="/login">
                LOG IN
              </Link>
            </li>
            <li className="center-link">
              <Link className="loginLink" to="/register">
                REGISTER
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
