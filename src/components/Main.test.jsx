import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Main from "./Main";
import { getCachedSpell, getSpell, getSpells } from "../api/spells";

jest.mock("../api/spells", () => ({
  getCachedSpell: jest.fn(() => null),
  getSpells: jest.fn(),
  getSpell: jest.fn()
}));

const spellList = [
  {index: "fireball", name: "Fireball", level: 3},
  {index: "mage-hand", name: "Mage Hand", level: 0}
];

function renderMain(overrides = {}) {
  return render(
    <Main
      savedSpells={[]}
      addSavedSpell={jest.fn()}
      removeSavedSpell={jest.fn()}
      preparedSpells={[]}
      addPreparedSpell={jest.fn()}
      removePreparedSpell={jest.fn()}
      showOverlay={false}
      setShowOverlay={jest.fn()}
      canEditSavedSpells={true}
      {...overrides}
    />
  );
}

beforeEach(() => {
  getCachedSpell.mockImplementation(index => {
    const spell = spellList.find(item => item.index === index);
    return spell ? {...spell, school: {name: "Evocation"}} : null;
  });
  getSpells.mockResolvedValue(spellList);
  getSpell.mockReset();
});

test("loads spell summaries and filters by search text", async () => {
  renderMain();

  expect(await screen.findByText("Fireball")).toBeInTheDocument();
  expect(screen.getByText("Mage Hand")).toBeInTheDocument();

  fireEvent.change(screen.getByRole("textbox", {name: "Search spells"}), {
    target: {value: "mage"}
  });

  expect(screen.getByText("Mage Hand")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByText("Fireball")).not.toBeInTheDocument();
  });
});

test("filters spell summaries by level without changing the source list", async () => {
  renderMain();

  await screen.findByText("Fireball");
  fireEvent.click(screen.getByRole("button", {name: "3"}));

  expect(screen.getByText("Fireball")).toBeInTheDocument();
  expect(screen.queryByText("Mage Hand")).not.toBeInTheDocument();
  expect(spellList).toHaveLength(2);
});

test("hides the filter sidebar without hiding the search bar", async () => {
  renderMain();
  await screen.findByText("Fireball");

  const searchBar = screen.getByRole("textbox", {name: "Search spells"});
  fireEvent.click(screen.getByRole("button", {name: "Hide filters"}));

  expect(screen.queryByRole("complementary", {name: "Spell filters"})).not.toBeInTheDocument();
  expect(searchBar).toBeInTheDocument();
  expect(screen.getByRole("button", {name: "Show filters"})).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(screen.getByRole("button", {name: "Show filters"}));
  expect(screen.getByRole("complementary", {name: "Spell filters"})).toBeInTheDocument();
});

test("removes a saved and prepared spell from a main-list card", async () => {
  const removeSavedSpell = jest.fn();
  const removePreparedSpell = jest.fn();

  renderMain({
    savedSpells: ["Fireball"],
    preparedSpells: ["Fireball"],
    removeSavedSpell,
    removePreparedSpell
  });

  await screen.findByText("Fireball");
  fireEvent.click(screen.getByRole("button", {
    name: "Remove Fireball from saved spells"
  }));

  expect(removeSavedSpell).toHaveBeenCalledWith("Fireball");
  expect(removePreparedSpell).toHaveBeenCalledWith("Fireball");
});
