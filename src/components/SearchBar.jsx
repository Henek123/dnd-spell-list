import React from 'react'
import './styles/SearchBar.css'
import { Search} from 'lucide-react';

export default function SearchBar(props) {
    const [searchInput, setSearchInput] = React.useState("")
    function handleChange(event){
        const value = event.target.value;
        setSearchInput(value);
        props.setSearched(value.toLowerCase());
    }
    function clearSearch(){
        setSearchInput("");
        props.setSearched("");
    }
    return (
        <section className='search-section'>
            <div className="search-bar-container">
                <Search className='search-icon' />
                <input
                    className="search-bar"
                    type="text"
                    name="search bar"
                    placeholder="Search..."
                    aria-label="Search spells"
                    onChange={handleChange}
                    value={searchInput}
                />
                <button type="button" className='search-clear-btn' aria-label="Clear search" onClick={clearSearch}>×</button>
            </div>
        </section>
  )
}