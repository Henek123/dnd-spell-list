import React from "react"
import "./styles/Spell.css"
import {UnmountClosed} from 'react-collapse';
import {getSpell} from "../api/spells.js"

export default function Spell(props){
    const [spell, setSpell] = React.useState(null);
    const [visibility, setVisibility] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [loadError, setLoadError] = React.useState(null);
    const [retryCount, setRetryCount] = React.useState(0);

    React.useEffect(() => {
        if (!visibility || spell) return undefined;

        let cancelled = false;
        setIsLoading(true);
        setLoadError(null);

        getSpell(props.spellIndex)
            .then(data => {
                if (!cancelled) setSpell(data);
            })
            .catch(error => {
                if (!cancelled) setLoadError(error);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [visibility, spell, props.spellIndex, retryCount]);

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

    const spellName = spell ? spell.name : props.nameSpell;
    const spellLevel = spell ? spell.level : props.level;
    const canEditSavedSpells = props.canEditSavedSpells !== false;
    const isPrepared = props.preparedSpells
        ? props.preparedSpells.includes(spellName)
        : false;
    const detailsId = `spell-details-${props.spellIndex}`;

    function prepared(event){
        if(event.target.checked === true){
            props.addPreparedSpell(spellName);
        } else{
            props.removePreparedSpell(spellName);
        }
    } 

    return(
            <div className={`spell-card ${props.saved ? "disable-box-shadow" : ""}`}>
                <h2>
                    {props.saved && <input
                        checked={isPrepared}
                        onChange={prepared}
                        className="prepared"
                        title="Is prepared"
                        type="checkbox"
                        disabled={!canEditSavedSpells}
                    />}
                    {props.savedSpells.includes(spellName) ? 
                        <button
                            type="button"
                            title="Remove from saved spells" 
                            className="red add-remove-top" 
                            onClick={() => {props.removeSavedSpell(spellName); if(isPrepared) props.removePreparedSpell(spellName)}}
                            disabled={!canEditSavedSpells}
                        >
                            —
                        </button>:
                        <button
                            type="button"
                            title="Add to saved spells"
                            className="green add-remove-top"
                            onClick={() => props.addSavedSpell(spellName)}
                            disabled={!canEditSavedSpells}
                        >+</button>
                    }
                    <span className="spell-name">{spellName}</span>
                </h2>
                <p style={{fontStyle: "italic"}}>
                    {level(spellLevel) + " "}
                    {spell && spell.school && spell.school.name + " "}
                    {spell && spell.ritual && "Ritual"}
                    <button
                        type="button"
                        className="expander"
                        aria-expanded={visibility}
                        aria-controls={detailsId}
                        onClick={toggle}
                    >{visibility ? "Shrink ↑" : "Expand ↓"}</button>
                </p>
                <div id={detailsId}>
                <UnmountClosed isOpened={visibility}>
                    {isLoading && <p>Loading spell details...</p>}
                    {loadError && <p role="alert">
                        Couldn’t load spell details: {loadError.message}{" "}
                        <button
                            type="button"
                            className="retry-button"
                            onClick={() => setRetryCount(count => count + 1)}
                        >Retry</button>
                    </p>}
                    {spell && <>
                        <hr style={{margin: "1em 0"}} />
                        <p><span>Casting Time:</span> {spell.casting_time}.</p>
                        <p><span>Range:</span> {spell.range}.</p>

                        {spell.components ? <p><span>Components:</span> {spell.components.map((item, index) =>
                            `${item}${index === spell.components.length - 1 ? '.' : ', '}`
                        )}</p> :
                        <p><span>Components:</span> None</p>}

                        <p><span>Materials:</span> {spell.material ? spell.material : "None."}</p>
                        <p><span>Duration:</span> {spell.duration}{!spell.concentration && '.'} {spell.concentration && "Concentration."}</p>

                        {spell.classes && <p style={{marginBottom: "1.5em"}}><span>Classes:</span> {spell.classes.map((item, index) =>
                            `${item.name}${index === spell.classes.length - 1 ? '.' : ', '}`
                        )}</p>}

                        <div className="description">{spell.desc && spell.desc.map(element => <p key={element}>{element}</p>)}</div>
                        {spell.higher_level && spell.higher_level.length > 0 && <>
                            <h3>Higher Level:</h3>
                            <hr />
                            <div className="description">{spell.higher_level.map(element => <p key={element}>{element}</p>)}</div>
                        </>}
                        <hr className="bottom-line"/>
                        {props.savedSpells.includes(spellName) ? 
                            <div className="add-remove-bottom">
                                <button
                                    type="button"
                                    disabled={!canEditSavedSpells}
                                    onClick={() => {props.removeSavedSpell(spellName); props.removePreparedSpell(spellName)}}
                                >
                                    Remove from saved
                                </button>
                            </div>:
                            <div className="add-remove-bottom">
                                <button
                                    type="button"
                                    disabled={!canEditSavedSpells}
                                    onClick={() => props.addSavedSpell(spellName)}
                                >Add to saved</button>
                            </div>
                        }
                    </>}
                </UnmountClosed>
                </div>
            </div>
    )
}
