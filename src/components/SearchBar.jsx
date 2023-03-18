import React from 'react'
import './styles/SearchBar.css'

export default function SearchBar(props) {

    function handleChange(event){
        props.setSearched(event.target.value.toLowerCase())
    }
    return (
        <div className="search-bar-container">
            <input
                className="search-bar"
                type="text"
                name="search bar"
                placeholder="Search..."
                onChange={handleChange}
            />
        </div>
  )
}
