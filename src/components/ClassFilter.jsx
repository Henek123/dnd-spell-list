import React from 'react'
import "./styles/ClassFilter.css"


export default function ClassFilter(props) {
  return (
    <div className="class-filter">
        <button onClick={() => {props.handleClick("bard")}}>Bard</button>
        <button onClick={() => {props.handleClick("cleric")}}>Cleric</button>
        <button onClick={() => {props.handleClick("druid")}}>Druid</button>
        <button onClick={() => {props.handleClick("paladin")}}>Paladin</button>
        <button onClick={() => {props.handleClick("sorcerer")}}>Sorcerer</button>
        <button onClick={() => {props.handleClick("warlock")}}>Warlock</button>
        <button onClick={() => {props.handleClick("wizard")}}>Wizard</button>
    </div>
  )
}
