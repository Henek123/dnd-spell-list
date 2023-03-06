import React from "react"
import "./styles/Header.css"
import Logo from "../img/DnD-Logo.png"

export default function Header(){
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth)
    
    React.useEffect(() => {
        function watchWidth() {
            setWindowWidth(window.innerWidth)
        }
        
        window.addEventListener("resize", watchWidth)
        
        return function() {
            window.removeEventListener("resize", watchWidth)
        }
    }, [])
    return(
        <header className="header">
            <img src ={Logo} alt="D&D Logo" className="logo"/>
            {windowWidth > 1000 ? <h1>Dungeons & Dragons Spell List</h1>:
            <h1>Spell List</h1>}
            <a className="return-btn" href="#anchor">Return To Top</a>
        </header>
    )
}