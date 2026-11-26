import React from 'react'
import "./styles/Filter.css"

export default function LevelFilter(props) {
  const [levelFilter, setLevelFilter] = React.useState(null);
  const [classFilter, setClassFilter] = React.useState(null);
  const {handleClick} = props;

  React.useEffect(() => {
    handleClick({
      level: levelFilter === null ? null : Number(levelFilter),
      className: classFilter
    });
  }, [levelFilter, classFilter, handleClick])

  //resetting filters
  function resetFilters(){
    setLevelFilter(null);
    setClassFilter(null)
  }
  
  //setting level filter
  function setLevel(event){
    let value = event.target.value
    setLevelFilter(prevState => prevState === value ? null : value)
  }

  //setting class filter
  function setClass(event){
    let value = event.target.value
    setClassFilter(prevState => prevState === value ? null : value)
  }
  return (
    <div id="filters" className="filters">
      <div className="filter-level">
        <p className="filter-label">Level:</p>
        <button 
          disabled={classFilter === "paladin"}
          aria-pressed={levelFilter === "0"}
          className={`
            ${classFilter === "paladin" ? "disabled" : undefined}
            ${levelFilter === "0"  ? "toggled" : undefined}`} 
          value={0} 
          onClick={setLevel}>
            Cantrips
        </button>
        <button 
          aria-pressed={levelFilter === "1"}
          className={levelFilter === "1"  ? "toggled" : undefined} 
          value={1} 
          onClick={setLevel}>
            Level 1
        </button>
        <button 
          aria-pressed={levelFilter === "2"}
          className={levelFilter === "2"  ? "toggled" : undefined} 
          value={2} 
          onClick={setLevel}>
            Level 2
        </button>
        <button 
          aria-pressed={levelFilter === "3"}
          className={levelFilter === "3"  ? "toggled" : undefined} 
          value={3} 
          onClick={setLevel}>
            Level 3
        </button>
        <button 
          aria-pressed={levelFilter === "4"}
          className={levelFilter === "4"  ? "toggled" : undefined} 
          value={4} 
          onClick={setLevel}>
            Level 4
        </button>
        <button 
          aria-pressed={levelFilter === "5"}
          className={levelFilter === "5"  ? "toggled" : undefined} 
          value={5} 
          onClick={setLevel}>
            Level 5
        </button>
        <button 
          aria-pressed={levelFilter === "6"}
          disabled={classFilter === "paladin" ? true : false} 
          className={
            `${classFilter === "paladin" ? "disabled" : undefined} 
            ${levelFilter === "6"  ? "toggled" : undefined}`
            } 
          value={6} onClick={setLevel}>
            Level 6
        </button>
        <button 
          aria-pressed={levelFilter === "7"}
          disabled={classFilter === "paladin" ? true : false} 
          className={
            `${classFilter === "paladin" ? "disabled" : undefined} 
            ${levelFilter === "7"  ? "toggled" : undefined}`
          } 
          value={7} onClick={setLevel}>
            Level 7
        </button>
        <button 
          aria-pressed={levelFilter === "8"}
          disabled={classFilter === "paladin" ? true : false} 
          className={
            `${classFilter === "paladin" ? "disabled" : undefined} 
            ${levelFilter === "8"  ? "toggled" : undefined}`
          } 
          value={8} onClick={setLevel}>
            Level 8
        </button>
        <button 
          aria-pressed={levelFilter === "9"}
          disabled={classFilter === "paladin" ? true : false} 
          className={
            `${classFilter === "paladin" ? "disabled" : undefined} 
            ${levelFilter === "9"  ? "toggled" : undefined}`
          } 
          value={9} onClick={setLevel}>
            Level 9
        </button>
      </div>
      <div className="filter-class">
        <p className="filter-label">Class:</p>
        <button 
          aria-pressed={classFilter === "bard"}
          className={classFilter === "bard"  ? "toggled" : undefined} 
          value="bard" 
          onClick={setClass}>
            Bard
        </button>
        <button 
          aria-pressed={classFilter === "cleric"}
          className={classFilter === "cleric"  ? "toggled" : undefined} 
          value="cleric" 
          onClick={setClass}>
            Cleric
        </button>
        <button 
          aria-pressed={classFilter === "druid"}
          className={classFilter === "druid"  ? "toggled" : undefined} 
          value="druid" 
          onClick={setClass}>
            Druid
        </button>
        <button
          aria-pressed={classFilter === "paladin"}
          disabled={
            levelFilter === "0" ? true : 
            levelFilter === "6" ? true : 
            levelFilter === "7" ? true :
            levelFilter === "8" ? true : 
            levelFilter === "9" ? true : false
          }  
          className={`
            ${
              levelFilter === "0" ? "disabled" :
              levelFilter === "6" ? "disabled" :  
              levelFilter === "7" ? "disabled" : 
              levelFilter === "8" ? "disabled" : 
              levelFilter === "9" ? "disabled" : 
              undefined
            }
            ${classFilter === "paladin"  ? "toggled" : undefined}`
          } 
          value="paladin" onClick={setClass}>
            Paladin
        </button>
        <button 
          aria-pressed={classFilter === "sorcerer"}
          className={classFilter === "sorcerer"  ? "toggled" : undefined} 
          value="sorcerer" 
          onClick={setClass}>
            Sorcerer
        </button>
        <button 
          aria-pressed={classFilter === "warlock"}
          className={classFilter === "warlock"  ? "toggled" : undefined} 
          value="warlock" 
          onClick={setClass}>
            Warlock
        </button>
        <button 
          aria-pressed={classFilter === "wizard"}
          className={classFilter === "wizard"  ? "toggled" : undefined} 
          value="wizard" 
          onClick={setClass}>
            Wizard
        </button>
      </div>
      <div className="controll-btns">
        <button className="clear-btn" onClick={() => {
          resetFilters()
        }}>
          Clear
        </button>
      </div>
    </div>
  )
}