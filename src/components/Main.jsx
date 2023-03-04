import React from "react"
import Spell from "./Spell.jsx";
import "./Main.css"
import {useQuery, gql} from "@apollo/client"

const GET_SPELLS= gql`
query {
    spells(limit: 1000) {
        index
      }
    }
`;

export default function Main(){
    const [spellNames, setSpellNames] = React.useState([]);

    const spells = useQuery(GET_SPELLS)
    
    
    React.useEffect(() => {
        if(spells.called === true && spells.loading === false){
            let spellIndex = spells.data.spells.map(item => item.index)
            spellIndex.sort();
            setSpellNames(spellIndex)
            }
    }, [spells.called, spells.loading])

    const list = spellNames.map(spell => (
        <Spell key={spell} spellName={spell}/>
    ))
    // console.log(spellNames)
    return(
        <>
        <div className="container">
            {list}
            <Spell spellName="acid-arrow" />
        </div>
        </>
    )
}

