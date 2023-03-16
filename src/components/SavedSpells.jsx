import React from 'react'
import "./styles/SavedSpell.css"
import Spell from './Spell'
import {useQuery, gql} from "@apollo/client"

export default function SavedSpells(props) {

  const GET_SPELL = gql`
    query {
      spells(limit: 1000){
        level
        name
      }
    }
  `
  const [spellList, setSpellList] = React.useState(null);

  const spell = useQuery(GET_SPELL)
  React.useEffect(() =>{
    if(spell.called && spell.loading === false){
        setSpellList(spell.data.spells)
    }
  }, [spell.called, spell.loading, props.savedSpells])

  React.useEffect(() => {
    if(spellList){
      let temp =[]
      for(let i = 0; i < props.savedSpells.length; i++){
        for(let j = 0; j < spellList.length; j++){
          if(props.savedSpells[i] === spellList[j].name){
            temp.push(spellList[j])
            break;
          }
        }
      }
      temp.sort((a, b) => a.level - b.level)
      setSortedSpellList(temp);
      temp =[];
    }
  },[spellList, props.savedSpells])
  const [sortedSpellList, setSortedSpellList] = React.useState([]);
  React.useEffect(() => {
    if(props.savedSpells.length === 0){
      setShowCantrips(false);
      setShowLevel1(false);
      setShowLevel2(false);
      setShowLevel3(false);
      setShowLevel4(false);
      setShowLevel5(false);
      setShowLevel6(false);
      setShowLevel7(false);
      setShowLevel8(false);
      setShowLevel9(false);
    }
  },[props.savedSpells])

  function getList(level){
    const filteredList = sortedSpellList.filter((spell) => spell.level === level)
    const list = filteredList.map((spell) => (
      <Spell 
        key={spell.name} 
        nameSpell={spell.name} 
        savedSpells={props.savedSpells} 
        removeSavedSpell={props.removeSavedSpell}
      />
    ))
    return list
  }
  const [showCantrips, setShowCantrips] = React.useState(false);
  const [showLevel1, setShowLevel1] = React.useState(false);
  const [showLevel2, setShowLevel2] = React.useState(false);
  const [showLevel3, setShowLevel3] = React.useState(false);
  const [showLevel4, setShowLevel4] = React.useState(false);
  const [showLevel5, setShowLevel5] = React.useState(false);
  const [showLevel6, setShowLevel6] = React.useState(false);
  const [showLevel7, setShowLevel7] = React.useState(false);
  const [showLevel8, setShowLevel8] = React.useState(false);
  const [showLevel9, setShowLevel9] = React.useState(false);
  const cantrips = getList(0);
  const level1 = getList(1);
  const level2 = getList(2);
  const level3 = getList(3);
  const level4 = getList(4);
  const level5 = getList(5);
  const level6 = getList(6);
  const level7 = getList(7);
  const level8 = getList(8);
  const level9 = getList(9);
  return (
    <section className='overlay'>
        <div className="overlay-container">
          <p className="hide-btn" onClick={() => props.setShowOverlay(false)}>X</p>
          {cantrips.length > 0 && <h1><span onClick={() => setShowCantrips(prevState => !prevState)}>Cantrips {showCantrips ? "↑" : "↓"}</span></h1>}
          {showCantrips && cantrips}
          {showCantrips && <hr className='divider' />}

          {level1.length > 0 && <h1><span onClick={() => setShowLevel1(prevState => !prevState)}>Level 1 {showLevel1 ? "↑" : "↓"}</span></h1>}
          {showLevel1 && level1}
          {showLevel1 && <hr className='divider' />}

          {level2.length > 0 && <h1><span onClick={() => setShowLevel2(prevState => !prevState)}>Level 2 {showLevel2 ? "↑" : "↓"}</span></h1>}
          {showLevel2 && level2}
          {showLevel2 && <hr className='divider' />}

          {level3.length > 0 && <h1><span onClick={() => setShowLevel3(prevState => !prevState)}>Level 3 {showLevel3 ? "↑" : "↓"}</span></h1>}
          {showLevel3 && level3}
          {showLevel3 && <hr className='divider' />}

          {level4.length > 0 && <h1><span onClick={() => setShowLevel4(prevState => !prevState)}>Level 4 {showLevel4 ? "↑" : "↓"}</span></h1>}
          {showLevel4 && level4}
          {showLevel4 && <hr className='divider' />}

          {level5.length > 0 && <h1><span onClick={() => setShowLevel5(prevState => !prevState)}>Level 5 {showLevel5 ? "↑" : "↓"}</span></h1>}
          {showLevel5 && level5}
          {showLevel5 && <hr className='divider' />}

          {level6.length > 0 && <h1><span onClick={() => setShowLevel6(prevState => !prevState)}>Level 6 {showLevel6 ? "↑" : "↓"}</span></h1>}
          {showLevel6 && level6}
          {showLevel6 && <hr className='divider' />}

          {level7.length > 0 && <h1><span onClick={() => setShowLevel7(prevState => !prevState)}>Level 7 {showLevel7 ? "↑" : "↓"}</span></h1>}
          {showLevel7 && level7}
          {showLevel7 && <hr className='divider' />}

          {level8.length > 0 && <h1><span onClick={() => setShowLevel8(prevState => !prevState)}>Level 8 {showLevel8 ? "↑" : "↓"}</span></h1>}
          {showLevel8 && level8}
          {showLevel8 && <hr className='divider' />}

          {level9.length > 0 && <h1><span onClick={() => setShowLevel9(prevState => !prevState)}>Level 9 {showLevel9 ? "↑" : "↓"}</span></h1>}
          {showLevel9 && level9}
          {showLevel9 && <hr className='divider' />}
        </div>
    </section>
  )
}
