import React from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
// import "./styles/Login.css"

export default function Login(props) {

  const [user, setUser] = React.useState(
    {
      email: "",
      password: "",
    }
  )

  function handleChange(event){
    setUser(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  //handle login

  function handleLogin(event){

    event.preventDefault();
    signInWithEmailAndPassword(props.auth, user.email, user.password)
    .then((userCredential) => {
      // Signed in 
      setError(false);
      const firebaseUser = userCredential.user;
      props.setUserUID(firebaseUser.uid)
      // ...
    })
    .catch((error) => {
      setError(true);
    });
  }

  const [error, setError] = React.useState();

  return (
    <>
      <p className="close-btn" onClick={() => props.setShowLogInModal(false)}>Close</p>
      <form onSubmit={(event) => handleLogin(event)}>
        <label htmlFor="e-mail">Your e-mail</label>
        <input 
          id="e-mail"
          type="email"
          name="email"
          required
          placeholder="e-mail"
          onChange={handleChange}
          value={user.email}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          minLength="6"
          required 
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
          value={user.password}
        />
        {error && <p className="error">Invalid e-mail or password</p>}
        <button>Log In</button>
      </form>
    </>
  )
}
