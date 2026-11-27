import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import Spell from "./Spell";
import { getCachedSpell, getSpell } from "../api/spells";

jest.mock("../api/spells", () => ({
  getCachedSpell: jest.fn(),
  getSpell: jest.fn()
}));

function renderSpell() {
  return render(
    <Spell
      spellIndex="fireball"
      nameSpell="Fireball"
      level={3}
      savedSpells={[]}
      addSavedSpell={jest.fn()}
      removeSavedSpell={jest.fn()}
    />
  );
}

beforeEach(() => {
  getCachedSpell.mockReturnValue(null);
  getSpell.mockReset();
});

test("shows the school as soon as spell details load without expanding the card", async () => {
  let resolveSpell;
  getSpell.mockReturnValue(new Promise(resolve => {
    resolveSpell = resolve;
  }));

  renderSpell();

  await waitFor(() => expect(getSpell).toHaveBeenCalledWith("fireball"));
  expect(screen.getByText("Loading…").closest(".spell-school"))
    .toHaveTextContent("Loading…");
  expect(screen.queryByText("Loading spell details...")).not.toBeInTheDocument();

  await act(async () => {
    resolveSpell({
      name: "Fireball",
      level: 3,
      school: {name: "Evocation"},
      desc: [],
      higher_level: []
    });
  });

  expect(screen.getByText("Evocation")).toBeInTheDocument();
  expect(screen.queryByText("Loading spell details...")).not.toBeInTheDocument();
});

test("uses cached school data without showing a loading message", () => {
  getCachedSpell.mockReturnValue({
    name: "Fireball",
    level: 3,
    school: {name: "Evocation"}
  });

  renderSpell();

  expect(screen.getByText("Evocation")).toBeInTheDocument();
  expect(screen.queryByText("Loading spell details...")).not.toBeInTheDocument();
  expect(getSpell).not.toHaveBeenCalled();
});
