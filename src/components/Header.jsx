import React from "react"
import "./styles/Header.css"
import Logo from "../img/logo.svg"
import LogInModal from "./LogInModal"
import { signOut } from "firebase/auth";
import { Sun, Moon } from 'lucide-react';


export default function Header(props){
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth)
    const [showLogInModal, setShowLogInModal] = React.useState(false);
    const [authActionError, setAuthActionError] = React.useState(null);

    //checking for windows width
    React.useEffect(() => {
        function watchWidth() {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener("resize", watchWidth)
        
        return function() {
            window.removeEventListener("resize", watchWidth)
        }
    }, [])

    //handling logout
    async function handleLogOut(){
        setAuthActionError(null);
        try {
            await signOut(props.auth);
            props.setUserUID(false);
        } catch (error) {
            setAuthActionError(error);
        }
    }
    return(
        <>
        <header className="header">
            <div className="logo-container">
                <img src ={Logo} alt="D&D Logo" className="logo"/>
                {windowWidth > 1000 ? <h1>Dungeons & Dragons Spell List</h1>:
                windowWidth > 400 ? <h1>Spell List</h1> : 
                <h1>Spells</h1>
                }
            </div>
            <div className="header-btns">
                <button type="button" className="theme-toggle-btn" onClick={() => props.setTheme(prevTheme => prevTheme === "light" ? "dark" : "light")}>
                    {props.theme === "light" ? <Moon /> : <Sun />}
                </button>
                {props.authLoading ? <span className="auth-status">Checking account…</span> :
                props.userUID ? 
                    <button type="button" className="log-out-btn" onClick={handleLogOut}>Log Out</button>:
                    <button type="button" className="log-in-btn" onClick={() => setShowLogInModal(true)}>Log In</button>
                }
                <button
                    type="button"
                    className="saved-spells-btn"
                    aria-expanded={props.showOverlay}
                    disabled={showLogInModal || props.authLoading}
                    onClick={props.toggleOverlay}
                >{props.showOverlay ? "Hide Saved Spells" : "Show Saved Spells"}</button>
                <a className="return-btn" href="#anchor">Return To Top</a>
            </div>
        </header>
        {authActionError && <p className="auth-error" role="alert">Couldn’t sign out. Please try again.</p>}
        {showLogInModal && 
            <LogInModal 
                setShowLogInModal={setShowLogInModal} 
                auth={props.auth} setUserUID={props.setUserUID} 
                userUID={props.userUID}
            />}
        </>
    )
}