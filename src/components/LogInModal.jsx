import React from 'react'
import "./styles/LogInModal.css"
import Login from './Login'
import Register from './Register'


export default function LogInModal(props) {

    const [singUp, setSingUp] = React.useState(false);
    function decideWhatToDisplay(signUp, userUID){
        if(signUp && !userUID){
            return (
                <>
                    <Register auth={props.auth} setUserUID={props.setUserUID} setShowLogInModal={props.setShowLogInModal}/>
                    <p onClick={() => setSingUp(prevState => !prevState)}>Create Account</p>
                </>
            )
        } else if(!userUID){
            return (
                <>
                    <Login auth={props.auth} setUserUID={props.setUserUID} setShowLogInModal={props.setShowLogInModal}/>
                    <p onClick={() => setSingUp(prevState => !prevState)}>Create Account</p>
                </>
            )
        } else{
            setTimeout(() => props.setShowLogInModal(false), 1000)
            return <h1>You are logged in</h1>
        }
    }
  return (
    <div className="login-container">
        <div className="dimmed" onClick={() => props.setShowLogInModal(false)}></div>
        <div className="modal">
            {decideWhatToDisplay(singUp, props.userUID)}
        </div>
    </div>
  )
}
