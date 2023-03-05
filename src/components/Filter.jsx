import React from 'react'
import "./styles/Filter.css"

export default function LevelFilter(props) {

  // const [filterVariables, setFilterVariables] = React.useState({
  //   variables: {
  //     "level": null,
  //     "class": null
  //   }
  // })

  const style ={
    
  }

  const [levelFilter, setLevelFilter] = React.useState(null);
  const [classFilter, setClassFilter] = React.useState(null);
  function filterSpells(){
    let temp = {
      variables: {
        "level": Number(levelFilter),
        "class": classFilter
      }
    }
    props.handleClick(temp)
  }
  function resetFilters(){
    let temp = {
      variables: {
        "level": null,
        "class": null
      }
    }
    props.handleClick(temp)
  }
  function setLevel(event){
    let value = event.target.value
    setLevelFilter(prevState => prevState === value ? null : value)
  }
  function setClass(event){
    let value = event.target.value
    setClassFilter(prevState => prevState === value ? null : value)
  }
  return (
    <>
    <div className="filter">
        <button className={levelFilter === "0"  ? "toggled" : undefined} value={0} onClick={setLevel}>Cantrips</button>
        <button className={levelFilter === "1"  ? "toggled" : undefined} value={1} onClick={setLevel}>Level 1</button>
        <button className={levelFilter === "2"  ? "toggled" : undefined} value={2} onClick={setLevel}>Level 2</button>
        <button className={levelFilter === "3"  ? "toggled" : undefined} value={3} onClick={setLevel}>Level 3</button>
        <button className={levelFilter === "4"  ? "toggled" : undefined} value={4} onClick={setLevel}>Level 4</button>
        <button className={levelFilter === "5"  ? "toggled" : undefined} value={5} onClick={setLevel}>Level 5</button>
        <button className={levelFilter === "6"  ? "toggled" : undefined} value={6} onClick={setLevel}>Level 6</button>
        <button className={levelFilter === "7"  ? "toggled" : undefined} value={7} onClick={setLevel}>Level 7</button>
        <button className={levelFilter === "8"  ? "toggled" : undefined} value={8} onClick={setLevel}>Level 8</button>
        <button className={levelFilter === "9"  ? "toggled" : undefined} value={9} onClick={setLevel}>Level 9</button>
    </div>
    <div className="filter">
        <button className={classFilter === "bard"  ? "toggled" : undefined} value="bard" onClick={setClass}>Bard</button>
        <button className={classFilter === "cleric"  ? "toggled" : undefined} value="cleric" onClick={setClass}>Cleric</button>
        <button className={classFilter === "druid"  ? "toggled" : undefined} value="druid" onClick={setClass}>Druid</button>
        <button className={classFilter === "paladin"  ? "toggled" : undefined} value="paladin" onClick={setClass}>Paladin</button>
        <button className={classFilter === "sorcerer"  ? "toggled" : undefined} value="sorcerer" onClick={setClass}>Sorcerer</button>
        <button className={classFilter === "warlock"  ? "toggled" : undefined} value="warlock" onClick={setClass}>Warlock</button>
        <button className={classFilter === "wizard"  ? "toggled" : undefined} value="wizard" onClick={setClass}>Wizard</button>
        <button onClick={filterSpells}>Apply</button>
        <button onClick={resetFilters}>Reset</button>
    </div>
    </>
  )
}