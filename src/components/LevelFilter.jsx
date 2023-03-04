import React from 'react'
import "./styles/LevelFilter.css"

export default function LevelFilter(props) {

  return (
    <div className="level-filter">
        <button onClick={() => {props.handleClick(0)}}>Level 0</button>
        <button onClick={() => {props.handleClick(1)}}>Level 1</button>
        <button onClick={() => {props.handleClick(2)}}>Level 2</button>
        <button onClick={() => {props.handleClick(3)}}>Level 3</button>
        <button onClick={() => {props.handleClick(4)}}>Level 4</button>
        <button onClick={() => {props.handleClick(5)}}>Level 5</button>
        <button onClick={() => {props.handleClick(6)}}>Level 6</button>
        <button onClick={() => {props.handleClick(7)}}>Level 7</button>
        <button onClick={() => {props.handleClick(8)}}>Level 8</button>
        <button onClick={() => {props.handleClick(9)}}>Level 9</button>
    </div>
  )
}