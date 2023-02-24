import { FieldState, Marks } from "@/features/game/types";
import { getWinnerCellsDict } from "@/features/game/utils/helpers/helpers";

describe("getWinner", () => {
  let fieldState: FieldState = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  let winnerCellsDict: ReturnType<typeof getWinnerCellsDict> = null;
  test(`if fieldState is ${JSON.stringify(
    fieldState
  )}, the winner should be ${winnerCellsDict}`, () => {
    expect(getWinnerCellsDict(fieldState)).toEqual(winnerCellsDict);
  });

  fieldState = [
    [Marks.X, null, null],
    [null, Marks.X, null],
    [null, null, Marks.X],
  ];
  winnerCellsDict = { 0: { 0: true }, 1: { 1: true }, 2: { 2: true } };
  test(`if fieldState is ${JSON.stringify(
    fieldState
  )}, the winner should be ${winnerCellsDict}`, () => {
    expect(getWinnerCellsDict(fieldState)).toEqual(winnerCellsDict);
  });

  fieldState = [
    [Marks.X, null, Marks.O],
    [null, Marks.O, null],
    [Marks.O, null, Marks.X],
  ];
  winnerCellsDict = { 0: { 2: true }, 1: { 1: true }, 2: { 0: true } };
  test(`if fieldState is ${JSON.stringify(
    fieldState
  )}, the winner should be ${winnerCellsDict}`, () => {
    expect(getWinnerCellsDict(fieldState)).toEqual(winnerCellsDict);
  });

  fieldState = [
    [Marks.O, Marks.O, Marks.O],
    [null, Marks.X, null],
    [Marks.X, null, Marks.X],
  ];
  winnerCellsDict = { 0: { 0: true, 1: true, 2: true } };
  test(`if fieldState is ${JSON.stringify(
    fieldState
  )}, the winner should be ${winnerCellsDict}`, () => {
    expect(getWinnerCellsDict(fieldState)).toEqual(winnerCellsDict);
  });

  fieldState = [
    [Marks.X, Marks.O, Marks.O],
    [Marks.X, Marks.O, null],
    [Marks.X, null, Marks.X],
  ];
  winnerCellsDict = { 0: { 0: true }, 1: { 0: true }, 2: { 0: true } };
  test(`if fieldState is ${JSON.stringify(
    fieldState
  )}, the winner should be ${winnerCellsDict}`, () => {
    expect(getWinnerCellsDict(fieldState)).toEqual(winnerCellsDict);
  });
});
