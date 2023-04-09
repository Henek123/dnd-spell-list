import React from "react"
import Spell from "./Spell.jsx";
import "./styles/Main.css"
import {useQuery, gql, useLazyQuery} from "@apollo/client"
import Filter from "./Filter.jsx"
import Loading from "./Loading.jsx";
import SavedSpells from "./SavedSpells.jsx";
import SearchBar from "./SearchBar.jsx";


export default function Main(props){
    const limit = 1000;
    const [searched, setSearched] = React.useState("");
    
    React.useEffect(() =>{
        
    }, [])
    
    //getting list of all spells
    const GET_SPELLS= gql`
    query {
        spells(limit: ${limit}) {
            name
          }
        }
    `;
    const spells = useQuery(GET_SPELLS)
    const [spellNames, setSpellNames] = React.useState([]);
    const [allSpellNames, setAllSpellNames] = React.useState([]);
    React.useEffect(() => {
        if(spells.called === true && spells.loading === false){
            let spellIndex = spells.data.spells.map(item => item.name)
            spellIndex.sort();
            setNumOfSpells(spellIndex.length)
            setAllSpellNames(spellIndex)
            setSpellNames(spellIndex)
        }
    }, [spells.called, spells.loading])

    //setting expiration date
    function setExpirationDate(){
        const expirationDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 30;
        localStorage.setItem('!expiration date', JSON.stringify(expirationDate))
    }
    //getting filtered spells list
    const GET_SPELLS_BY_FILTER= gql`
        query GetFilteredSpells($class: StringFilter, $level: IntFilter) {
            spells(limit: ${limit}, class: $class, level: $level) {
                name
      }
    }
    
    `;
    const [filteredSpells, filteredSpellsResults] = useLazyQuery(GET_SPELLS_BY_FILTER);
    const [spellFilter, setSpellFilter] = React.useState(null);
    const [isFiltered, setIsFiltered] = React.useState(false);
    const [allFilteredSpells, setAllFilteredSpells] = React.useState();
    React.useEffect(() =>{
        if(
            filteredSpellsResults.called === true &&
            filteredSpellsResults.loading === false &&
            filteredSpellsResults.data
        ){
            let result = filteredSpellsResults.data.spells.map(item => item.name);
            result.sort()
            if(
                spellFilter !== null &&
                (spellFilter.variables.class !== null ||
                spellFilter.variables.level !== null)
            ){
                setIsFiltered(true);
            } else{
                setIsFiltered(false)
            }
            if(searched === "") setSpellNames(result);
            setAllFilteredSpells(result);
        }
    }, [filteredSpellsResults.called, filteredSpellsResults.data, filteredSpellsResults.loading])
    React.useEffect(() => {
        filteredSpells(spellFilter)
    }, [spellFilter])
    //setting loading screen
    const [spellsLoaded, setSpellsLoaded] = React.useState(0);
    const [numOfSpells, setNumOfSpells] = React.useState(0);
    
    //mapping spell list
    const list = spellNames.map(spell => (
        <Spell 
            key={spell} 
            nameSpell={spell} 
            loaded={setSpellsLoaded} 
            savedSpells={props.savedSpells}
            addSavedSpell={props.addSavedSpell}
            removeSavedSpell={props.removeSavedSpell}
            setExpirationDate={setExpirationDate}
            expirationDate={localStorage.getItem('!expiration date')}
        />
        ))
    //hide scroll in main if modal is open
    React.useEffect(() => {
        props.showOverlay ? document.body.style.overflow = 'hidden' : document.body.style.overflow = ''
    }, [props.showOverlay])
    
    React.useEffect(() => {
        let filteredData
        if(searched !== ""){
            if(isFiltered){
                filteredData = allFilteredSpells.filter((spell) => {
                    return spell.toLowerCase().includes(searched)
                }
                )
                setSpellNames(filteredData)
            } else{
                filteredData = allSpellNames.filter((spell) => {
                    return spell.toLowerCase().includes(searched)
                }
                )
                setSpellNames(filteredData)
            }
        } else{
            isFiltered ? setSpellNames(allFilteredSpells) : setSpellNames(allSpellNames)
        }
    }, [searched, isFiltered, spellFilter, allFilteredSpells])
    return(
        <>
        <div className="container">
            <p id="anchor"></p>
            {props.showOverlay && <SavedSpells 
                savedSpells={props.savedSpells} 
                removeSavedSpell={props.removeSavedSpell}
                setShowOverlay={props.setShowOverlay}
                preparedSpells={props.preparedSpells}
                addPreparedSpell={props.addPreparedSpell}
                removePreparedSpell={props.removePreparedSpell}
            />}
            <Filter handleClick={setSpellFilter} loaded={setSpellsLoaded} />
            <SearchBar searched={searched} setSearched={setSearched} />
            {(spellsLoaded <= numOfSpells - 1 || allSpellNames.length ===0) && <Loading />}
            {list.length > 0 ? list : <h1>No Results</h1>}
        </div>
        </>
    )
}