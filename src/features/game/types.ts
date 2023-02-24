export enum Marks {
  X = "x",
  O = "o",
}

export type CellState = Marks | null;

export type FieldRowState = CellState[];

export type FieldState = FieldRowState[];

export type WinnerCellsDict = Partial<{
  [rowIndex: number]: Partial<{ [cellIndex: number]: true }>;
}>;

export type CellRef = HTMLButtonElement;

export type CellRefs = Partial<{
  [rowIndex: number]: Partial<{ [cellIndex: number]: CellRef }>;
}>;

export type CurrentFocusedCellPosition = {
  rowIndex: number;
  cellIndex: number;
};

export enum ArrowKeysCodes {
  LEFT = "ArrowLeft",
  UP = "ArrowUp",
  RIGHT = "ArrowRight",
  DOWN = "ArrowDown",
}

export type ScoresDict = { [mark in Marks]: number };
