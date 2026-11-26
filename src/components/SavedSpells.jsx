import React from 'react'
import "./styles/SavedSpell.css"
import Spell from './Spell'

export default function SavedSpells(props) {
  const [expandedLevels, setExpandedLevels] = React.useState({});
  const savedSpellNames = React.useMemo(
    () => new Set(props.savedSpells),
    [props.savedSpells]
  );
  const levels = React.useMemo(() => {
    const savedSpells = props.spellList
      .filter(spell => savedSpellNames.has(spell.name))
      .sort((first, second) => first.level - second.level);

    return Array.from({length: 10}, (_, level) => ({
      level,
      title: level === 0 ? "Cantrips" : `Level ${level}`,
      spells: savedSpells.filter(spell => spell.level === level)
    }));
  }, [props.spellList, savedSpellNames]);

  React.useEffect(() => {
    if (props.savedSpells.length === 0) setExpandedLevels({});
  }, [props.savedSpells]);

  function getSpellCards(spells) {
    return spells.map(spell => (
      <Spell
        saved={true}
        key={spell.index}
        spellIndex={spell.index}
        nameSpell={spell.name}
        level={spell.level}
        savedSpells={props.savedSpells}
        removeSavedSpell={props.removeSavedSpell}
        preparedSpells={props.preparedSpells}
        addPreparedSpell={props.addPreparedSpell}
        removePreparedSpell={props.removePreparedSpell}
        canEditSavedSpells={props.canEditSavedSpells}
      />
    ));
  }

  return (
    <section className='overlay' role="dialog" aria-modal="true" aria-label="Saved spells">
      <div className="overlay-container">
        <button
          type="button"
          className="hide-btn"
          aria-label="Close saved spells"
          onClick={() => props.setShowOverlay(false)}
        >×</button>
        {levels.map(({level, title, spells}, index) => {
          if (spells.length === 0) return null;

          const expanded = Boolean(expandedLevels[level]);
          const hasHigherLevelSpells = levels
            .slice(index + 1)
            .some(nextLevel => nextLevel.spells.length > 0);

          return (
            <React.Fragment key={level}>
              <h1>
                <button
                  type="button"
                  className="saved-level-toggle"
                  aria-expanded={expanded}
                  onClick={() => setExpandedLevels(current => ({
                    ...current,
                    [level]: !current[level]
                  }))}
                >
                  {title} {expanded ? "↑" : "↓"}
                </button>
              </h1>
              {expanded && getSpellCards(spells)}
              {expanded && hasHigherLevelSpells && <hr className='divider' />}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  )
}
