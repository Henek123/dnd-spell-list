import React from 'react'
import "./styles/Filter.css"

export default function LevelFilter(props) {
  const [levelFilter, setLevelFilter] = React.useState(null);
  const [classFilter, setClassFilter] = React.useState(null);
  const {handleClick} = props;

  const levels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const classes = ["bard", "cleric", "druid", "paladin", "sorcerer", "warlock", "wizard"];
  const unavailablePaladinLevels = ["0", "6", "7", "8", "9"];

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

  function fillLevelButtons(){
    return levels.map(level => {
      const disabled = classFilter === "paladin" &&
        unavailablePaladinLevels.includes(level);

      return (
        <button 
          key={level}
          disabled={disabled}
          aria-pressed={levelFilter === level}
          className={disabled ? "disabled" : levelFilter === level ? "toggled" : undefined}
          value={level} 
          onClick={setLevel}>
          {level > 0 ? level : "Cantrips"}
        </button>
      )
    })
  }

  function fillClassButtons(){
    return classes.map(className => {
      const disabled = className === "paladin" &&
        unavailablePaladinLevels.includes(levelFilter);

      return (
        <button 
          key={className}
          disabled={disabled}
          aria-pressed={classFilter === className}
          className={disabled ? "disabled" : classFilter === className ? "toggled" : undefined}
          value={className} 
          onClick={setClass}>
          {className.charAt(0).toUpperCase() + className.slice(1)}
        </button>
      )
    })
  }

  return (
    <div id="filters" className="filters">
      <div className="filter-level">
        <p className="filter-label">Level:</p>
          {fillLevelButtons()}
      </div>
      <div className="filter-class">
        <p className="filter-label">Class:</p>
        {fillClassButtons()}
      </div>
      <div className="control-btns">
        <button className="clear-btn" onClick={() => {
          resetFilters()
        }}>
          Clear
        </button>
      </div>
    </div>
  )
}