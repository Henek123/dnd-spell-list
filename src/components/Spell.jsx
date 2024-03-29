import React from "react"
import "./styles/Spell.css"
import {useQuery, useLazyQuery, gql} from "@apollo/client"
import {UnmountClosed} from 'react-collapse';

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
    const [spell, setSpell] = React.useState(0);
    const [callAPI, spellName] = useLazyQuery(GET_SPELL, {variables: {"name": props.nameSpell}})
    React.useEffect(() => {
        if(props.expirationDate > new Date().getTime() && localStorage.getItem(`${props.nameSpell}`)){
            setSpell(JSON.parse(localStorage.getItem(props.nameSpell)))
            if(props.loaded){
                props.loaded(prevState => prevState + 1)
            }
        } else{
            console.log('calling api')
            if(props.nameSpell === "Fireball" && props.expirationDate < new Date().getTime()){
                props.setExpirationDate()
            }
            callAPI()
        }
    }, [])
    React.useEffect(() =>{
        if(spellName.called && spellName.loading === false){
            let index = spellName.data.spells.findIndex((spell) => spell.name === props.nameSpell)
            setSpell(spellName.data.spells[index])
            if(props.loaded){
                props.loaded(prevState => prevState + 1)
            }
        }
    }, [spellName.called, spellName.loading])
    
    React.useEffect(() => {
        if(props.expirationDate > new Date().getTime() && !localStorage.getItem(`${props.nameSpell}`) && spell !== 0){
            localStorage.setItem(props.nameSpell, JSON.stringify(spell));
        }
    },[spell])
    
    //toggling visibility of spell card
    const [visibility, setVisibility] = React.useState(false);
    function toggle(){
        setVisibility(prevState => !prevState)
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
                    <p className="description" >{spell.higher_level.map(element => <p key={element}>{element}</p>)}</p>
                </>
            )
        }
    }

    const [isPrepared, setIsPrepared] = React.useState(false);

    function prepared(event){
        setIsPrepared(event.target.checked);
        if(event.target.checked === true){
            props.addPreparedSpell(spell.name);
        } else{
            props.removePreparedSpell(spell.name);
        }
    } 
    React.useEffect(() => {
        if(props.preparedSpells && props.preparedSpells.includes(spell.name)) setIsPrepared(true);
    })
    return(
            <div className={`spell-card ${props.saved ? "disable-box-shadow" : ""}`}>
                <h2>
                    {props.saved && <input checked={isPrepared} onChange={prepared} className="prepared" title="Is prepared" type="checkbox" />}
                    {props.savedSpells.includes(spell.name) ? 
                        <span 
                            title="Remove from saved spells" 
                            className="red add-remove-top" 
                            onClick={() => {props.removeSavedSpell(spell.name); if(isPrepared) props.removePreparedSpell(spell.name)}}
                        >
                            —
                        </span>:
                        <span title="Add to saved spells"className="green add-remove-top" onClick={() => {props.addSavedSpell(spell.name)}}>+</span> 
                    }
                    <span className="spell-name">{spell.name}</span>
                </h2>
                <p style={{fontStyle: "italic"}}>
                    {level(spell.level) + " "}
                    {spell.school && spell.school.name + " "}
                    {spell.ritual && "Ritual"}
                    <span className="expander" onClick={toggle}>{visibility ? "Shrink ↑" : "Expand ↓"}</span>
                </p>
                <UnmountClosed isOpened={visibility}>
                    <hr style={{margin: "1em 0"}} />
                    <p><span>Casting Time:</span> {spell.casting_time}.</p>
                    <p><span>Range:</span> {spell.range}.</p>

                    {spell.components ? <p><span>Components:</span> {spell.components.map(item => {
                        if(item === spell.components[spell.components.length - 1]){
                            return item + '.'
                        } else{
                            return item + ', '
                        }
                    })}</p> :
                    <p><span>Components:</span> "None"</p>}

                    <p><span>Materials:</span> {spell.material ? spell.material : "None."}</p>
                    <p><span>Duration:</span> {spell.duration}{!spell.concentration && '.'} {spell.concentration && "Concentration."}</p>

                    {spell.classes && <p style={{marginBottom: "1.5em"}}><span>Classes:</span> {spell.classes.map(item => {
                        if(item.name === spell.classes[spell.classes.length - 1].name){
                            return item.name + '.'
                        } else{
                            return item.name + ", "
                        }
                    })}</p>}

                    <p className="description" >{spell.desc && spell.desc.map(element => <p key={element}>{element}</p>)}</p>
                    {spell.higher_level && getHigerLevel()}
                    <hr className="bottom-line"/>
                    {props.savedSpells.includes(spell.name) ? 
                        <p 
                            className="add-remove-bottom"
                        >
                            <span onClick={() => {props.removeSavedSpell(spell.name); props.removePreparedSpell(spell.name)}}>
                                Remove from saved
                            </span>
                        </p>:
                        <p className="add-remove-bottom"><span onClick={() => {props.addSavedSpell(spell.name)}}>Add to saved</span></p> 
                    }
                </UnmountClosed>
            </div>
    )
}
