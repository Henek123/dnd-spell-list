import React from 'react'
import "./styles/LogInModal.css"
import Login from './Login'
import Register from './Register'


export default function LogInModal(props) {
    const {
        auth,
        setShowLogInModal,
        setUserUID,
        userUID
    } = props;
    const [signUp, setSignUp] = React.useState(false);

    React.useEffect(() => {
        function closeOnEscape(event) {
            if (event.key === "Escape") setShowLogInModal(false);
        }

        const previouslyFocused = document.activeElement;
        window.addEventListener("keydown", closeOnEscape);
        document.querySelector(".modal input")?.focus();

        return () => {
            window.removeEventListener("keydown", closeOnEscape);
            previouslyFocused?.focus();
        };
    }, [setShowLogInModal]);

    React.useEffect(() => {
        if (!userUID) return undefined;
        const timeout = window.setTimeout(
            () => setShowLogInModal(false),
            1000
        );
        return () => window.clearTimeout(timeout);
    }, [userUID, setShowLogInModal]);

  return (
    <div className="login-container">
        <div className="dimmed" onClick={() => setShowLogInModal(false)}></div>
        <div className="modal" role="dialog" aria-modal="true" aria-label="Account access">
            {userUID
                ? <h1>You are logged in</h1>
                : <>
                    {signUp
                        ? <Register
                            auth={auth}
                            setUserUID={setUserUID}
                            setShowLogInModal={setShowLogInModal}
                        />
                        : <Login
                            auth={auth}
                            setUserUID={setUserUID}
                            setShowLogInModal={setShowLogInModal}
                        />}
                    <button
                        type="button"
                        className="switch-mode"
                        onClick={() => setSignUp(previous => !previous)}
                    >
                        {signUp ? "Already have an account? Log in" : "Create Account"}
                    </button>
                </>}
        </div>
    </div>
  )
}
