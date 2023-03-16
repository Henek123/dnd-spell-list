import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import './App.css';
import Main from "./components/Main.jsx";
import Header from "./components/Header.jsx";
import React from 'react';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";



function App() {
  const [userUID, setUserUID] = React.useState(false)

  const firebaseConfig = {
    
    apiKey: process.env.REACT_APP_API_KEY,
    
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    
    projectId: process.env.REACT_APP_PROJECT_ID,
    
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    
    appId: process.env.REACT_APP_APP_ID,
    
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
    
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  
  const db = getFirestore(app);
  // const analytics = getAnalytics(app);

  const [showOverlay, setShowOverlay] = React.useState(false)
    function toggleVisibility(){
        setShowOverlay(prevState => !prevState);
    }

  const [savedSpells, setSavedSpells] = React.useState([]);

  React.useEffect(() =>{
    if(userUID){
      const docRef = doc(db, "saved-spells", userUID);
      const data = {spells: savedSpells};
      setDoc(docRef, data)
    }

  }, [savedSpells]);

  React.useEffect(() =>{
    (async () => {
      if(userUID){
        const docRef = doc(db, "saved-spells", userUID);
        const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSavedSpells(docSnap.data().spells)
      } else {
      }
      }
    }) ();
  }, [userUID]);

  function addSavedSpell(spellName){
    setSavedSpells(prevState => [...prevState, spellName])
  }
  function removeSavedSpell(spellName){
    const filteredArray = savedSpells.filter(item => (item !== spellName))
    setSavedSpells(filteredArray)
  }
  return (
    <>
      <Header 
        showOverlay={showOverlay} 
        toggleOverlay={toggleVisibility} 
        auth={auth} setUserUID={setUserUID} 
        userUID={userUID}
        setSavedSpells={setSavedSpells}
      />
      <Main
        savedSpells={savedSpells} 
        addSavedSpell={addSavedSpell}
        removeSavedSpell={removeSavedSpell}
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        toggleOverlay={toggleVisibility}
      />
    </>
  );
}

export default App;
