import React from "react"
import "./styles/Spell.css"
import {UnmountClosed} from 'react-collapse';
import {getCachedSpell, getSpell} from "../api/spells.js"
import { Bookmark, ChevronDown } from 'lucide-react';

const diceRollRegex = /(\b\d+d\d+\b)/gi;

function formatDescription(text) {
    return text.split(diceRollRegex).map((part, index) =>
        index % 2 === 1 ? <b key={index}>{part}</b> : part
    );
}

export default function Spell(props){
    const [spell, setSpell] = React.useState(() => getCachedSpell(props.spellIndex));
    const [visibility, setVisibility] = React.useState(false);
    const [isNearViewport, setIsNearViewport] = React.useState(
        typeof window.IntersectionObserver === "undefined"
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [loadError, setLoadError] = React.useState(null);
    const [retryCount, setRetryCount] = React.useState(0);
    const cardRef = React.useRef(null);
    React.useEffect(() => {
        const card = cardRef.current;
        if (!card || typeof window.IntersectionObserver === "undefined") {
            setIsNearViewport(true);
            return undefined;
        }

        const observer = new window.IntersectionObserver(
            entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    setIsNearViewport(true);
                    observer.disconnect();
                }
            },
            {rootMargin: "300px"}
        );
        observer.observe(card);
        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        if ((!isNearViewport && !visibility) || spell) return undefined;

        let cancelled = false;
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
        if (!getCachedSpell(props.spellIndex)) {
            setIsLoading(true);
        }

        return () => {
            cancelled = true;
        };
    }, [isNearViewport, visibility, spell, props.spellIndex, retryCount]);

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
            <div ref={cardRef} className={`spell-card ${props.saved ? "disable-box-shadow" : ""}`}>
                <div className="spell-card-header">
                    <div>
                        {props.saved && <input
                            checked={isPrepared}
                            onChange={prepared}
                            className="prepared"
                            title="Is prepared"
                            type="checkbox"
                            disabled={!canEditSavedSpells}
                        />}
                        <h2 className="spell-name">{spellName}</h2>
                    </div>
                    <span className="spell-level">{level(spellLevel) + " "}</span>
                </div>
                <div className="spell-card-subheader">
                    <div className="spell-school" aria-live="polite">
                        {spell && spell.school
                            ? spell.school.name
                            : loadError
                                ? "Unavailable"
                                : "Loading…"}
                        {spell && spell.ritual && " · Ritual"}
                    </div>
                    <div>
                        {props.savedSpells.includes(spellName) ? 
                            <button
                                type="button"
                                title="Remove from saved spells"
                                aria-label={`Remove ${spellName} from saved spells`}
                                className="saved add-remove-top" 
                                onClick={() => {props.removeSavedSpell(spellName); if(isPrepared) props.removePreparedSpell(spellName)}}
                                disabled={!canEditSavedSpells}
                            >
                                <Bookmark/>
                            </button>:
                            <button
                                type="button"
                                title="Add to saved spells"
                                className="not-saved add-remove-top"
                                onClick={() => props.addSavedSpell(spellName)}
                                disabled={!canEditSavedSpells}
                            >
                                <Bookmark/>
                            </button>
                        }
                        <button
                            type="button"
                            className="expander"
                            aria-expanded={visibility}
                            aria-controls={detailsId}
                            title={visibility ? "Hide spell details" : "Show spell details"}
                            onClick={toggle}
                        >
                            <ChevronDown
                                className={`expander-icon ${visibility ? "is-expanded" : ""}`}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                    {spell && <>
                        <hr className="spell-card-subheader-divider"/>
                        <div className="spell-card-subheader-bottom">
                            <p><b>Casting Time:</b>
                                <br/> {spell.casting_time}.
                            </p>
                            <p><b>Range:</b>
                                <br/> {spell.range}.
                            </p>
                            <p>
                                <b>Duration:</b>
                                <br/> {spell.duration}{!spell.concentration && '.'} {spell.concentration && "Concentration."}
                            </p>
                        </div>
                    </>}
                </div>
                <div id={detailsId}>
                <UnmountClosed isOpened={visibility}>
                    {visibility && isLoading && !spell && <p>Loading spell details...</p>}
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
                        

                        {spell.components ? <p><b>Components:</b> {spell.components.map((item, index) =>
                            `${item}${index === spell.components.length - 1 ? '.' : ', '}`
                        )}</p> :
                        <p><b>Components:</b> None</p>}
                        <p><b>Materials:</b> {spell.material ? spell.material : "None."}</p>
                        {spell.classes && <p style={{marginBottom: "1.5em"}}><b>Classes:</b> {spell.classes.map((item, index) =>
                            `${item.name}${index === spell.classes.length - 1 ? '.' : ', '}`
                        )}</p>}

                        <div className="description">{spell.desc && spell.desc.map((element, index) => <p key={index}>{formatDescription(element)}</p>)}</div>
                        {spell.higher_level && spell.higher_level.length > 0 && <>
                            <h3>Higher Level:</h3>
                            <hr />
                            <div className="description">{spell.higher_level.map((element, index) => <p key={index}>{formatDescription(element)}</p>)}</div>
                        </>}
                    </>}
                </UnmountClosed>
                </div>
            </div>
    )
}
