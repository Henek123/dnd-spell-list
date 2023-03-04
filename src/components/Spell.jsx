import React from "react"
import "./styles/Spell.css"

export default function Spell(props){
    
    const [spell, setSpell] = React.useState({});
    const [visibility, setVisibility] = React.useState(false);

    function toggle(){
        setVisibility(prevState => !prevState)
    }

    React.useEffect(() =>{
        fetch(`https://www.dnd5eapi.co/api/spells/${props.spellName}`)
            .then(res => res.json())
            .then(data => setSpell(data))
    }, [props.spellName])

    function level(level){
        if(level === 0) return `Cantrip`
        if(level === 1) return `${level}st level`
        if(level === 2) return `${level}nd level`
        if(level === 3) return `${level}rd level`
        return `${level}th level`
    }


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

    const style = {
        marginBottom: visibility ? "1.5em" : "0", 
        fontStyle: "italic"
    }

    return(
        <>
            <div className="spell-card" onClick={toggle}>
                <h2>{spell.name}</h2>
                <p style={style}>
                    {level(spell.level) + " "}
                    {spell.school && spell.school.index.charAt(0).toUpperCase() + spell.school.index.slice(1)}
                    <span className="expander">{visibility ? "Shrink" : "Expand"}</span>
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
                    item.index.charAt(0).toUpperCase() + item.index.slice(1) + " "
                    ))}</p>}

                <p>{spell.desc}</p>

                {spell.higher_level && getHigerLevel()}
                </>}
            </div>
        </>
    )
}