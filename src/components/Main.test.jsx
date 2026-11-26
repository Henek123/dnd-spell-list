import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Main from "./Main";
import { getSpells } from "../api/spells";

jest.mock("../api/spells", () => ({
  getSpells: jest.fn(),
  getSpell: jest.fn()
}));

const spellList = [
  {index: "fireball", name: "Fireball", level: 3},
  {index: "mage-hand", name: "Mage Hand", level: 0}
];

function renderMain() {
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
    />
  );
}

beforeEach(() => {
  getSpells.mockResolvedValue(spellList);
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
  fireEvent.click(screen.getByRole("button", {name: "Level 3"}));

  expect(screen.getByText("Fireball")).toBeInTheDocument();
  expect(screen.queryByText("Mage Hand")).not.toBeInTheDocument();
  expect(spellList).toHaveLength(2);
});
