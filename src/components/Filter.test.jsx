import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Filter from "./Filter";

test.each(["Cantrips", "6", "7", "8", "9"])(
  "disables Paladin when %s is selected",
  level => {
    render(<Filter handleClick={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", {name: level}));

    expect(screen.getByRole("button", {name: "Paladin"})).toBeDisabled();
  }
);

test("keeps Paladin available at level 5 and disables incompatible levels after selecting it", () => {
  render(<Filter handleClick={jest.fn()} />);

  fireEvent.click(screen.getByRole("button", {name: "5"}));
  const paladinButton = screen.getByRole("button", {name: "Paladin"});
  expect(paladinButton).toBeEnabled();

  fireEvent.click(paladinButton);

  expect(screen.getByRole("button", {name: "Cantrips"})).toBeDisabled();
  expect(screen.getByRole("button", {name: "Cantrips"})).toHaveClass("disabled");
  expect(screen.getByRole("button", {name: "6"})).toBeDisabled();
  expect(screen.getByRole("button", {name: "6"})).toHaveClass("disabled");
  expect(screen.getByRole("button", {name: "7"})).toHaveClass("disabled");
  expect(screen.getByRole("button", {name: "8"})).toHaveClass("disabled");
  expect(screen.getByRole("button", {name: "9"})).toHaveClass("disabled");
  expect(screen.getByRole("button", {name: "5"})).toBeEnabled();
});
