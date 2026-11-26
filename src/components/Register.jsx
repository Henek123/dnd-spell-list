import React from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register(props) {

  const [user, setUser] = React.useState(
    {
      email: "",
      password: "",
      confirmPassword: "",
    }
  )

  function handleChange(event){
    setUser(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }
  const [passwordConfirmation, setPasswordConfirmation] = React.useState(null)
  const [registrationError, setRegistrationError] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleRegister(event){
    event.preventDefault();
    setPasswordConfirmation(null);
    setRegistrationError(false);
    if(user.password !== user.confirmPassword){
      setPasswordConfirmation("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        props.auth,
        user.email,
        user.password
      );
      props.setUserUID(userCredential.user.uid);
      props.setShowLogInModal(false);
    } catch {
      setRegistrationError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      <form onSubmit={handleRegister}>
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
          minLength="6"
          required 
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
          value={user.password}
        />
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          required
          type="password"
          name="confirmPassword"
          placeholder="confirm password"
          onChange={handleChange}
          value={user.confirmPassword}
        />
        {passwordConfirmation && <p className="error">{passwordConfirmation}</p>}
        {registrationError && <p className="error" role="alert">Couldn’t create an account. Check your email and password.</p>}
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account…" : "Sign Up"}</button>
      </form>
  )
}
