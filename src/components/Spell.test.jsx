import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

test("bolds dice notation in spell descriptions", () => {
  getCachedSpell.mockReturnValue({
    name: "Fireball",
    level: 3,
    school: {name: "Evocation"},
    desc: ["The spell deals 8d6 fire damage and 2D4 extra damage."],
    higher_level: ["Damage increases by 1d6 for each slot level."]
  });

  renderSpell();
  fireEvent.click(screen.getByRole("button", {name: "Show spell details"}));

  expect(screen.getByText("8d6").tagName).toBe("B");
  expect(screen.getByText("2D4").tagName).toBe("B");
  expect(screen.getByText("1d6").tagName).toBe("B");
});
