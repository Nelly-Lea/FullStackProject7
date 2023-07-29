import React from "react"
import { Link } from "react-router-dom"

import { Outlet } from "react-router-dom"

export default function Layout() {
    const Username=JSON.parse(localStorage["currentUser"]).username;
    return (
        <>
        <header className="home-container">
            <nav>
                <ul className="menu">
                  
                    <li>
                        <Link to={`/users/${Username}/info`}>Infos</Link>
                    </li>
                    <li>
                        <Link to={`/users/${Username}/todos`}>Todos</Link>
                    </li>
                    <li>
                        <Link to={`/users/${Username}/posts`}>Posts</Link>
                    </li>
                    <li>
                        <Link to={`/users/${Username}/albums`}>Albums</Link>
                    </li>
                    <li>
                        <Link to={"/"}>Logout</Link>
                    </li>
                </ul>
                <h1 >Welcome {Username}</h1>
            </nav>
        </header>
        <Outlet />
        </>
    )
}