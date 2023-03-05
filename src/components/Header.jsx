import React from "react"
import "./styles/Header.css"
import Logo from "../img/DnD-Logo.png"

export default function Header(){

    return(
        <header className="header">
            <img src ={Logo} alt="D&D Logo" className="logo"/>
            <h1>Dungeons & Dragons Spell List</h1>
            <a className="return-btn" href="#anchor">Return To Top</a>
        </header>
    )
}