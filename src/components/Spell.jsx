import React from "react"
import "./styles/Spell.css"
import {useQuery, gql} from "@apollo/client"

export default function Spell(props){

    //getting spell by name
    const GET_SPELL = gql`
    query GetSpell($name: String) {
      spells(name: $name){
        level
        material
        range
        ritual
        school {
          name
        }
        components
        classes {
          name
        }
        desc
        higher_level
        duration
        casting_time
        concentration
        name
      }
    }
    `
    const [spell, setSpell] = React.useState({});
    const spellName = useQuery(GET_SPELL, {variables: {"name": props.nameSpell}})
    React.useEffect(() =>{
        if(spellName.called && spellName.loading === false){
            props.nameSpell === "Fireball" ? setSpell(spellName.data.spells[1]) : setSpell(spellName.data.spells[0]);;
            if(props.loaded){
                props.loaded(prevState => prevState + 1)
            }
        }
    }, [spellName.called, spellName.loading])
    
    //toggling visibility of spell card
    const [visibility, setVisibility] = React.useState(false);
    function toggle(){
        setVisibility(prevState => !prevState)
    }
    const style = {
        marginBottom: visibility ? "1.5em" : "0", 
        fontStyle: "italic"
    }

    //settling level on spell card
    function level(level){
        if(level === 0) return `Cantrip`
        if(level === 1) return `${level}st level`
        if(level === 2) return `${level}nd level`
        if(level === 3) return `${level}rd level`
        return `${level}th level`
    }

    //setting higer level of a spell
    function getHigerLevel(){
        if(spell.higher_level.length !== 0){
            return (
                <>
                    <h3>Higher Level:</h3>
                    <hr />
                    <p>{spell.higher_level}</p>
                </>
            )
        }
    }
    return(
            <div className="spell-card">
                <h2>{spell.name}</h2>
                <p style={style}>
                    {level(spell.level) + " "}
                    {spell.school && spell.school.name + " "}
                    {spell.ritual && "Ritual"}
                    <span className="expander" onClick={toggle}>{visibility ? "Shrink" : "Expand"}</span>
                </p>
                {visibility && <>
                <hr />
                <p><span>Casting Time:</span> {spell.casting_time}</p>
                <p><span>Range:</span> {spell.range}</p>

                {spell.components ? <p><span>Components:</span> {spell.components.map(item => `${item} `)}</p> :
                <p><span>Components:</span> "None"</p>}

                <p><span>Materials:</span> {spell.material ? spell.material : "None"}</p>
                <p><span>Duration:</span> {spell.duration} {spell.concentration && "Concentration"}</p>

                {spell.classes && <p style={{marginBottom: "1.5em"}}><span>Classes:</span> {spell.classes.map(item => (
                    item.name + " "
                    ))}</p>}

                <p>{spell.desc}</p>
                {spell.higher_level && getHigerLevel()}
                <hr className="bottom-line"/>
                {props.savedSpells.includes(spell.name) ? 
                    <p className="add-remove" onClick={() => {props.removeSavedSpell(spell.name)}}>Remove from saved</p>:
                    <p className="add-remove" onClick={() => {props.addSavedSpell(spell.name)}}>Add to saved</p> 
                }
                </>}
            </div>
    )
}