import React from "react"
import Spell from "./Spell.jsx";
import "./styles/Main.css"
import {useQuery, gql, useLazyQuery} from "@apollo/client"
import Filter from "./Filter.jsx"
import Loading from "./Loading.jsx";


export default function Main(){

    React.useEffect(() =>{

    }, [])

    //getting list of all spells
    const GET_SPELLS= gql`
    query {
        spells(limit: 1000) {
            name
          }
        }
    `;
    const spells = useQuery(GET_SPELLS)
    const [spellNames, setSpellNames] = React.useState([]);
    React.useEffect(() => {
        if(spells.called === true && spells.loading === false){
            let spellIndex = spells.data.spells.map(item => item.name)
            spellIndex.sort();
            setNumOfSpells(spellIndex.length)
            setSpellNames(spellIndex)
            }
    }, [spells.called, spells.loading])

    //getting filtered spells list
    const GET_SPELLS_BY_FILTER= gql`
        query GetFilteredSpells($class: StringFilter, $level: IntFilter) {
            spells(limit: 1000, class: $class, level: $level) {
                name
      }
    }
    
    `;
    const [filteredSpells, filteredSpellsResults] = useLazyQuery(GET_SPELLS_BY_FILTER);
    const [spellFilter, setSpellFilter] = React.useState(null);
    React.useEffect(() =>{
        if(filteredSpellsResults.called === true && filteredSpellsResults.loading === false && filteredSpellsResults.data){
            let result = filteredSpellsResults.data.spells.map(item => item.name);
            result.sort()
            setNumOfSpells(result.length)
            setSpellNames(result);
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
        <Spell key={spell} nameSpell={spell} loaded={setSpellsLoaded}/>
    ))

    return(
        <>
        <div className="container">
            <p id="anchor"></p>
            <Filter handleClick={setSpellFilter} loaded={setSpellsLoaded} />
            {spellsLoaded <= numOfSpells - 1 && <Loading />}
            {list}
            {/* <Spell nameSpell="Acid Arrow" /> */}
        </div>
        </>
    )
}

