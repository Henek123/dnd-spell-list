import React from "react"
import "./styles/Header.css"
import Logo from "../img/logo.svg"
import LogInModal from "./LogInModal"
import { signOut } from "firebase/auth";


export default function Header(props){
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth)
    const [showLogInModal, setShowLogInModal] = React.useState(false);
    React.useEffect(() => {
        function watchWidth() {
            setWindowWidth(window.innerWidth)
        }
        
        window.addEventListener("resize", watchWidth)
        
        return function() {
            window.removeEventListener("resize", watchWidth)
        }
    }, [])
    function handleLogOut(){
        signOut(props.auth).then(() => {
            props.setUserUID(false);
            props.setSavedSpells([])
          }).catch((error) => {
            console.log(error)
          });
    }
    return(
        <>
        <header className="header">
            <img src ={Logo} alt="D&D Logo" className="logo"/>
            {windowWidth > 1000 ? <h1>Dungeons & Dragons Spell List</h1>:
            <h1>Spell List</h1>}
            {props.userUID ? 
                <p className="log-out-btn" onClick={() => handleLogOut()}>Log Out</p>:
                <p className="log-in-btn" onClick={() => setShowLogInModal(prevState => !prevState)}>Log In</p>
            }
            <p className="saved-spells-btn" onClick={props.toggleOverlay}>{props.showOverlay ? "Hide Saved Spells" : "Show Saved Spells"}</p>
            <a className="return-btn" href="#anchor">Return To Top</a>
        </header>
        {showLogInModal && 
            <LogInModal 
                setShowLogInModal={setShowLogInModal} 
                auth={props.auth} setUserUID={props.setUserUID} 
                userUID={props.userUID}
            />}
        </>
    )
}