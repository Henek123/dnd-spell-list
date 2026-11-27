import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './App.css';
import Main from "./components/Main.jsx";
import Header from "./components/Header.jsx";
import React from 'react';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import Footer from "./components/Footer.jsx";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function App() {
  const [userUID, setUserUID] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [authError, setAuthError] = React.useState(null);
  const [cloudDataError, setCloudDataError] = React.useState(null);
  const [loadAttempt, setLoadAttempt] = React.useState(0);
  const [saveAttempt, setSaveAttempt] = React.useState(0);
  const [loadedUserUID, setLoadedUserUID] = React.useState(null);
  const [userDataLoading, setUserDataLoading] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [savedSpells, setSavedSpells] = React.useState([]);
  const [preparedSpells, setPreparedSpells] = React.useState([]);
  const [theme, setTheme] = React.useState("light");

  React.useEffect(() => onAuthStateChanged(
    auth,
    user => {
      setUserUID(user ? user.uid : false);
      setAuthError(null);
      setAuthLoading(false);
    },
    error => {
      setAuthError(error);
      setAuthLoading(false);
    }
  ), []);

  React.useEffect(() => {
    if (!userUID) {
      setSavedSpells([]);
      setPreparedSpells([]);
      setLoadedUserUID(null);
      setUserDataLoading(false);
      setCloudDataError(null);
      return undefined;
    }

    let cancelled = false;
    setLoadedUserUID(null);
    setCloudDataError(null);
    setUserDataLoading(true);

    async function loadUserSpells() {
      try {
        const savedRef = doc(db, userUID, "saved-spells");
        const preparedRef = doc(db, userUID, "prepared-spells");
        const [savedSnapshot, preparedSnapshot] = await Promise.all([
          getDoc(savedRef),
          getDoc(preparedRef)
        ]);
        const saved = savedSnapshot.exists() ? savedSnapshot.data().spells : [];
        const prepared = preparedSnapshot.exists() ? preparedSnapshot.data().prepared : [];

        if (!Array.isArray(saved) || !Array.isArray(prepared)) {
          throw new Error("The saved spell data has an unexpected format.");
        }

        if (!cancelled) {
          setSavedSpells(saved);
          setPreparedSpells(prepared);
          setLoadedUserUID(userUID);
        }
      } catch (error) {
        if (!cancelled) setCloudDataError(error);
      } finally {
        if (!cancelled) setUserDataLoading(false);
      }
    }

    loadUserSpells();
    return () => {
      cancelled = true;
    };
  }, [userUID, loadAttempt]);

  React.useEffect(() => {
    if (!userUID || loadedUserUID !== userUID) return;

    Promise.all([
      setDoc(doc(db, userUID, "saved-spells"), {spells: savedSpells}),
      setDoc(doc(db, userUID, "prepared-spells"), {prepared: preparedSpells})
    ])
      .then(() => setCloudDataError(null))
      .catch(error => setCloudDataError(error));
  }, [userUID, loadedUserUID, savedSpells, preparedSpells, saveAttempt]);

  function toggleVisibility() {
    setShowOverlay(previous => !previous);
  }

  function addSavedSpell(spellName) {
    setSavedSpells(previous =>
      previous.includes(spellName) ? previous : [...previous, spellName]
    );
  }

  function removeSavedSpell(spellName) {
    setSavedSpells(previous => previous.filter(item => item !== spellName));
  }

  function addPreparedSpell(spellName) {
    setPreparedSpells(previous =>
      previous.includes(spellName) ? previous : [...previous, spellName]
    );
  }

  function removePreparedSpell(spellName) {
    setPreparedSpells(previous => previous.filter(item => item !== spellName));
  }

  const canEditSavedSpells = !authLoading && !userDataLoading &&
    (!userUID || loadedUserUID === userUID);

  return (
    <div data-theme={theme}>
      <Header
        showOverlay={showOverlay}
        toggleOverlay={toggleVisibility}
        auth={auth}
        setUserUID={setUserUID}
        userUID={userUID}
        authLoading={authLoading}
        theme={theme}
        setTheme={setTheme}
      />
      {(authError || cloudDataError) && <p className="app-error" role="alert">
        {authError
          ? "Unable to check your sign-in status."
          : `Unable to load or save your spells: ${cloudDataError.message}`}
        {cloudDataError && userUID &&
          <button type="button" onClick={() => {
            if (loadedUserUID !== userUID) {
              setLoadAttempt(attempt => attempt + 1);
            } else {
              setSaveAttempt(attempt => attempt + 1);
            }
          }}>
            {loadedUserUID !== userUID ? "Retry loading" : "Retry saving"}
          </button>}
      </p>}
      {(authLoading || userDataLoading) &&
        <p className="account-sync-status" role="status">Loading account data…</p>}
      <Main
        savedSpells={savedSpells}
        addSavedSpell={addSavedSpell}
        removeSavedSpell={removeSavedSpell}
        preparedSpells={preparedSpells}
        addPreparedSpell={addPreparedSpell}
        removePreparedSpell={removePreparedSpell}
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        canEditSavedSpells={canEditSavedSpells}
      />
      <Footer />
    </div>
  );
}

export default App;
