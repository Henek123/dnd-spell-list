import React from "react"
import Spell from "./Spell.jsx";
import "./styles/Main.css"
import Filter from "./Filter.jsx"
import Loading from "./Loading.jsx";
import SavedSpells from "./SavedSpells.jsx";
import SearchBar from "./SearchBar.jsx";
import {getSpells} from "../api/spells.js"

export default function Main(props){
    const [searched, setSearched] = React.useState("");
    const [spellSummaries, setSpellSummaries] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState(null);
    const [spellFilter, setSpellFilter] = React.useState({
        level: null,
        className: null
    });
    const [classSpells, setClassSpells] = React.useState(null);
    const [isClassLoading, setIsClassLoading] = React.useState(false);
    const [classLoadError, setClassLoadError] = React.useState(null);
    const [filtersVisible, setFiltersVisible] = React.useState(true);

    React.useEffect(() => {
        let cancelled = false;

        async function loadSpells() {
            try {
                const spells = await getSpells();
                if (!cancelled) setSpellSummaries(spells);
            } catch (error) {
                if (!cancelled) setLoadError(error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadSpells();

        return () => {
            cancelled = true;
        };
    }, []);

    React.useEffect(() => {
        if (!spellFilter.className) {
            setClassSpells(null);
            setClassLoadError(null);
            setIsClassLoading(false);
            return undefined;
        }

        let cancelled = false;
        setClassSpells(null);
        setClassLoadError(null);
        setIsClassLoading(true);

        getSpells({className: spellFilter.className})
            .then(spells => {
                if (!cancelled) setClassSpells(spells);
            })
            .catch(error => {
                if (!cancelled) setClassLoadError(error);
            })
            .finally(() => {
                if (!cancelled) setIsClassLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [spellFilter.className]);

    const availableSpells = spellFilter.className
        ? classSpells || []
        : spellSummaries;
    const visibleSpells = [...availableSpells]
        .filter(spell =>
            (spellFilter.level === null || spell.level === spellFilter.level) &&
            spell.name.toLowerCase().includes(searched)
        )
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))

    React.useEffect(() => {
        document.body.style.overflow = props.showOverlay ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [props.showOverlay]);

    const list = visibleSpells.map(spell => (
        <Spell
            key={spell.index}
            spellIndex={spell.index}
            nameSpell={spell.name}
            level={spell.level}
            savedSpells={props.savedSpells}
            addSavedSpell={props.addSavedSpell}
            removeSavedSpell={props.removeSavedSpell}
            preparedSpells={props.preparedSpells}
            addPreparedSpell={props.addPreparedSpell}
            removePreparedSpell={props.removePreparedSpell}
            canEditSavedSpells={props.canEditSavedSpells}
        />
    ));

    return(
        <div className={`container${filtersVisible ? "" : " filters-collapsed"}`}>
            {/* <p id="anchor"></p> */}
            {props.showOverlay && <SavedSpells
                spellList={spellSummaries}
                savedSpells={props.savedSpells}
                removeSavedSpell={props.removeSavedSpell}
                setShowOverlay={props.setShowOverlay}
                preparedSpells={props.preparedSpells}
                addPreparedSpell={props.addPreparedSpell}
                removePreparedSpell={props.removePreparedSpell}
                canEditSavedSpells={props.canEditSavedSpells}
            />}
            <button
                type="button"
                className="filter-toggle"
                aria-expanded={filtersVisible}
                aria-controls="spell-filters"
                onClick={() => setFiltersVisible(visible => !visible)}
            >
                {filtersVisible ? "Hide filters" : "Show filters"}
            </button>
            <aside
                id="spell-filters"
                className="filter-sidebar"
                aria-label="Spell filters"
                hidden={!filtersVisible}
            >
                <Filter handleClick={setSpellFilter} />
            </aside>
            <SearchBar searched={searched} setSearched={setSearched} />
            <section className="spell-list">
                {(isLoading || isClassLoading) && <Loading />}
                {(loadError || classLoadError) &&
                    <p role="alert">Couldn’t load spells: {(loadError || classLoadError).message}</p>}
                {!isLoading && !isClassLoading && !loadError && !classLoadError &&
                    (list.length > 0 ? list : <h1>No Results</h1>)}
            </section>
        </div>
    )
}
