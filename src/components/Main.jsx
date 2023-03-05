import React from "react"
import Spell from "./Spell.jsx";
import "./styles/Main.css"
import {useQuery, gql, useLazyQuery} from "@apollo/client"
import Filter from "./Filter.jsx"

const GET_SPELLS= gql`
query {
    spells(limit: 1000) {
        index
      }
    }
`;

const GET_SPELLS_BY_FILTER= gql`
    query GetFilteredSpells($class: StringFilter, $level: IntFilter) {
        spells(limit: 1000, class: $class, level: $level) {
            index
  }
}

`;

export default function Main(){
    const spells = useQuery(GET_SPELLS)
    const [spellNames, setSpellNames] = React.useState([]);
    React.useEffect(() => {
        if(spells.called === true && spells.loading === false){
            let spellIndex = spells.data.spells.map(item => item.index)
            spellIndex.sort();
            setSpellNames(spellIndex)
            }
    }, [spells.called, spells.loading])

    const [filteredSpells, filteredSpellsResults] = useLazyQuery(GET_SPELLS_BY_FILTER);
    const [spellFilter, setSpellFilter] = React.useState(null);
    React.useEffect(() =>{
        if(filteredSpellsResults.called === true && filteredSpellsResults.loading === false && filteredSpellsResults.data){
            let result = filteredSpellsResults.data.spells.map(item => item.index);
            result.sort()
            setSpellNames(result);
        }
    }, [filteredSpellsResults.called, filteredSpellsResults.data, filteredSpellsResults.loading])

    React.useEffect(() => {
      console.log(spellFilter)
      filteredSpells(spellFilter)
    }, [spellFilter])


    const list = spellNames.map(spell => (
        <Spell key={spell} spellName={spell}/>
    ))
    return(
        <>
        <div className="container">
            <Filter handleClick={setSpellFilter} />
            {list}
        </div>
        </>
    )
}

