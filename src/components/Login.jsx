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

  const [error, setError] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleLogin(event){
    event.preventDefault();
    setError(false);
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        props.auth,
        user.email,
        user.password
      );
      const firebaseUser = userCredential.user;
      props.setUserUID(firebaseUser.uid)
      props.setShowLogInModal(false);
    } catch {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      <form onSubmit={handleLogin}>
        <div className='wrapper'>
          <label htmlFor="e-mail">Your e-mail</label>
          <button type="button" className="close-btn" aria-label="Close" onClick={() => props.setShowLogInModal(false)}>×</button>
        </div>
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
        {error && <p className="error" role="alert">Couldn’t sign in. Check your email and password.</p>}
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Log In"}</button>
      </form>
  )
}
