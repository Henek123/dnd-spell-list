import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import './App.css';
import Main from "./components/Main.jsx";
import Header from "./components/Header.jsx";
import React from 'react';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import Footer from "./components/Footer.jsx";

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
  //visibility of saved spells overlay
  const [showOverlay, setShowOverlay] = React.useState(false)
    function toggleVisibility(){
        setShowOverlay(prevState => !prevState);
    }
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  
  const db = getFirestore(app);
  // const analytics = getAnalytics(app);

  const [savedSpells, setSavedSpells] = React.useState([]);
  const [preparedSpells, setPreparedSpells] = React.useState([]);

  //saving data to firestore
  React.useEffect(() =>{
    if(userUID){
      const docRef = doc(db, userUID, "saved-spells");
      const data = {spells: savedSpells};
      setDoc(docRef, data)
    }

  }, [savedSpells]);

  React.useEffect(() =>{
    if(userUID){
      const docRef = doc(db, userUID, "prepared-spells");
      const data = {prepared: preparedSpells};
      setDoc(docRef, data)
    }

  }, [preparedSpells]);

  //loading data from firestore
  React.useEffect(() =>{
    (async () => {
      if(userUID){
        const docRefSaved = doc(db, userUID, "saved-spells");
        const docRefPrepared = doc(db, userUID, "prepared-spells" );
        const docSnapSaved = await getDoc(docRefSaved);
        const docSnapPrepared = await getDoc(docRefPrepared);
      if (docSnapSaved.exists()) {
        setSavedSpells(docSnapSaved.data().spells)
      }
      if(docSnapPrepared.exists()){
        setPreparedSpells(docSnapPrepared.data().prepared)
      }
      }
    }) ();
  }, [userUID]);

  //adding/removing spells from saved spells
  function addSavedSpell(spellName){
    setSavedSpells(prevState => [...prevState, spellName])
  }
  function removeSavedSpell(spellName){
    const filteredArray = savedSpells.filter(item => (item !== spellName))
    setSavedSpells(filteredArray)
  }

 
  //adding/removing spells from prepared spells
  function addPreparedSpell(spellName){
    setPreparedSpells(prevState => [...prevState, spellName])
  }
  function removePreparedSpell(spellName){
    const filteredArray = preparedSpells.filter(item => (item !== spellName))
    setPreparedSpells(filteredArray)
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
        preparedSpells={preparedSpells}
        addPreparedSpell={addPreparedSpell}
        removePreparedSpell={removePreparedSpell}
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        toggleOverlay={toggleVisibility}
      />
      <Footer />
    </>
  );
}

export default App;
