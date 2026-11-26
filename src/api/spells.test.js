import { normalizeSpell } from "./spells";

test("normalizes the 2024 REST spell text fields for the card UI", () => {
  const spell = normalizeSpell({
    description: "A spell description.",
    higher_level: "The damage increases at higher levels."
  });

  expect(spell.desc).toEqual(["A spell description."]);
  expect(spell.higher_level).toEqual(["The damage increases at higher levels."]);
});

test("preserves text fields that are already arrays", () => {
  const spell = normalizeSpell({
    desc: ["First paragraph.", "Second paragraph."],
    higher_level: []
  });

  expect(spell.desc).toEqual(["First paragraph.", "Second paragraph."]);
  expect(spell.higher_level).toEqual([]);
});
