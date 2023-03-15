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
  }, [spell.called, spell.loading])

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
  },[spellList])
  const [sortedSpellList, setSortedSpellList] = React.useState([]);
  
  React.useEffect(() => {

  })
  const list = sortedSpellList.map((spell) => (
    <Spell 
      key={spell.name} 
      nameSpell={spell.name} 
      savedSpells={props.savedSpells} 
      removeSavedSpell={props.removeSavedSpell}
    />
  ))


  return (
    <section className='overlay'>
        <div className="overlay-container">
          <p className="hide-btn" onClick={() => props.setShowOverlay(false)}>X</p>
          {list}
        </div>
    </section>
  )
}
