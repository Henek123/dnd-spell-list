import React from 'react'
import "./styles/SavedSpell.css"
import Spell from './Spell'

export default function SavedSpells(props) {
  const list = props.savedSpells.map((spell) => (
    <Spell 
      key={spell} 
      nameSpell={spell} 
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
