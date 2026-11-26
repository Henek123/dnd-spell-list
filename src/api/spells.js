import axios from "axios";

const apiVersion = "2024";
const api = axios.create({
  baseURL: `https://www.dnd5eapi.co/api/${apiVersion}`,
});

const spellCacheDuration = 1000 * 60 * 60 * 24 * 30;
const spellRequests = new Map();

export function normalizeSpell(spell) {
  const description = spell.desc || spell.description;
  const higherLevel = spell.higher_level;

  return {
    ...spell,
    desc: Array.isArray(description)
      ? description
      : description
        ? [description]
        : [],
    higher_level: Array.isArray(higherLevel)
      ? higherLevel
      : higherLevel
        ? [higherLevel]
        : [],
  };
}

export async function getSpells({ className } = {}) {
  const endpoint = className
    ? `/classes/${encodeURIComponent(className)}/spells`
    : "/spells";
  const { data } = await api.get(endpoint);
  return data.results;
}

function readCachedSpell(cacheKey) {
  try {
    const cachedValue = window.localStorage.getItem(cacheKey);
    if (!cachedValue) return null;

    const cachedSpell = JSON.parse(cachedValue);
    if (cachedSpell.expiresAt > Date.now() && cachedSpell.data) {
      return cachedSpell.data;
    }
  } catch (error) {
    console.warn("Unable to read the spell cache.", error);
  }
  return null;
}

function writeCachedSpell(cacheKey, spell) {
  try {
    window.localStorage.setItem(
      cacheKey,
      JSON.stringify({
        expiresAt: Date.now() + spellCacheDuration,
        data: spell,
      })
    );
  } catch (error) {
    console.warn("Unable to write the spell cache.", error);
  }
}

export async function getSpell(index) {
  if (!index) throw new Error("A spell index is required.");

  const cacheKey = `dnd5e-spell-${apiVersion}-v2:${index}`;
  const cachedSpell = readCachedSpell(cacheKey);
  if (cachedSpell) return cachedSpell;
  if (spellRequests.has(index)) {
    return spellRequests.get(index);
  }

  const request = api
    .get(`/spells/${encodeURIComponent(index)}`)
    .then(({ data }) => {
      const spell = normalizeSpell(data);
      writeCachedSpell(cacheKey, spell);
      return spell;
    })
    .finally(() => {
      spellRequests.delete(index);
    });

  spellRequests.set(index, request);
  return request;
}
