import {
  CellRef,
  CellRefs,
  CurrentFocusedCellPosition,
  FieldRowState,
  FieldState,
  Marks,
  WinnerCellsDict,
} from "@/features/game/types";

export const canWinnerExist = (field: FieldState): boolean => {
  for (let rowIndex = 0; rowIndex < field.length; rowIndex++) {
    const currentRow = field[rowIndex];
    const cell = currentRow[rowIndex];
    const isCellFilled = cell !== null;
    if (isCellFilled) return true;
  }

  return false;
};

export const getWinnerFromRow = (row: FieldRowState): Marks | null => {
  for (let i = 0; i < row.length - 1; i++) {
    const cell = row[i];
    const isCellFilled = cell !== null;
    if (!isCellFilled) return null;

    const nextCell = row[i + 1];
    if (cell !== nextCell) return null;
  }

  return row[0];
};

export const getWinnerFromColumn = (
  field: FieldState,
  columnIndex: number
): Marks | null => {
  const topRow = field[0];

  for (let i = 0; i < field.length - 1; i++) {
    const currentRow = field[i];
    const cell = currentRow[columnIndex];
    const isCellFilled = cell !== null;
    if (!isCellFilled) return null;

    const nextRow = field[i + 1];
    const nextCell = nextRow[columnIndex];
    if (cell !== nextCell) return null;
  }

  return topRow[columnIndex];
};

export const getWinnerFromDiagonal = (
  field: FieldState,
  rightToLeft: boolean = false
): Marks | null => {
  const topRow = field[0];

  for (let rowIndex = 0; rowIndex < field.length - 1; rowIndex++) {
    const currentRow = field[rowIndex];
    const cell =
      currentRow[rightToLeft ? field.length - 1 - rowIndex : rowIndex];
    const isCellFilled = cell !== null;
    if (!isCellFilled) return null;

    const nextRowIndex = rowIndex + 1;
    const nextRow = field[nextRowIndex];
    const nextCell =
      nextRow[rightToLeft ? field.length - 1 - nextRowIndex : nextRowIndex];
    if (cell !== nextCell) return null;
  }

  return topRow[rightToLeft ? topRow.length - 1 : 0];
};

export const getWinnerCellsDict = (
  fieldState: FieldState
): WinnerCellsDict | null => {
  if (!canWinnerExist(fieldState)) return null;

  const winnerRowIndex = fieldState.findIndex(getWinnerFromRow);
  if (winnerRowIndex !== -1) {
    const row = fieldState[winnerRowIndex];
    return {
      [winnerRowIndex]: Object.fromEntries(
        row.map((_, cellIndex) => [cellIndex, true])
      ),
    };
  }

  const winnerColumnIndex = fieldState[0].findIndex((_, columnIndex) =>
    getWinnerFromColumn(fieldState, columnIndex)
  );
  if (winnerColumnIndex !== -1) {
    return Object.fromEntries(
      fieldState.map((_, rowIndex) => [rowIndex, { [winnerColumnIndex]: true }])
    );
  }

  const winnerFromLeftDiagonal = getWinnerFromDiagonal(fieldState);
  if (winnerFromLeftDiagonal) {
    return Object.fromEntries(
      fieldState.map((_, rowIndex) => [rowIndex, { [rowIndex]: true }])
    );
  }

  const winnerFromRightDiagonal = getWinnerFromDiagonal(fieldState, true);
  if (winnerFromRightDiagonal) {
    return Object.fromEntries(
      fieldState.map((row, rowIndex) => [
        rowIndex,
        { [row.length - 1 - rowIndex]: true },
      ])
    );
  }

  return null;
};

export const getWinner = (
  fieldState: FieldState,
  winnerCellsDict: WinnerCellsDict
): Marks | null => {
  const rowIndex = Number(Object.keys(winnerCellsDict)[0]);
  if (Number.isNaN(rowIndex)) return null;

  const rowDict = winnerCellsDict[rowIndex];
  if (!rowDict) return null;

  const cellIndex = Number(Object.keys(rowDict)[0]);
  if (Number.isNaN(cellIndex)) return null;

  return fieldState[rowIndex][cellIndex];
};

export const checkFieldHasEmptyCell = (fieldState: FieldState): boolean =>
  fieldState.some((row) => row.some((cell) => cell === null));

export const getFirstFocusableCell = (params: {
  fieldState: FieldState;
  cellRefs: CellRefs;
}): CellRef | null => {
  const { fieldState, cellRefs } = params;

  for (let rowIndex = 0; rowIndex < fieldState.length; rowIndex++) {
    const firstNotFilledCellIndex = fieldState[rowIndex].findIndex(
      (cellState) => cellState === null
    );

    if (firstNotFilledCellIndex !== -1)
      return cellRefs[rowIndex]?.[firstNotFilledCellIndex] ?? null;
  }

  return null;
};

export const getNextEmptyLeftCell = (params: {
  fieldState: FieldState;
  cellRefs: CellRefs;
  currentFocusedCellPosition: CurrentFocusedCellPosition;
}): CellRef | null => {
  const { fieldState, cellRefs, currentFocusedCellPosition } = params;

  const rowRefs = cellRefs[currentFocusedCellPosition.rowIndex];
  if (!rowRefs) return null;

  let nextIndex = currentFocusedCellPosition.cellIndex - 1;

  while (nextIndex >= 0) {
    const nextCell = rowRefs[nextIndex];

    if (nextCell === undefined) {
      return null;
    }

    const isNextCellFilled = Boolean(
      fieldState[currentFocusedCellPosition.rowIndex][nextIndex]
    );
    if (isNextCellFilled) {
      nextIndex = nextIndex - 1;
      continue;
    }

    return nextCell;
  }

  return null;
};
export const getNextEmptyRightCell = (params: {
  fieldState: FieldState;
  cellRefs: CellRefs;
  currentFocusedCellPosition: CurrentFocusedCellPosition;
}): CellRef | null => {
  const { fieldState, cellRefs, currentFocusedCellPosition } = params;

  const rowLength = fieldState[0].length;
  const rowRefs = cellRefs[currentFocusedCellPosition.rowIndex];
  if (!rowRefs) return null;

  let nextIndex = currentFocusedCellPosition.cellIndex + 1;

  while (nextIndex < rowLength) {
    const nextCell = rowRefs[nextIndex];

    if (nextCell === undefined) {
      return null;
    }

    const isNextCellFilled = Boolean(
      fieldState[currentFocusedCellPosition.rowIndex][nextIndex]
    );
    if (isNextCellFilled) {
      nextIndex = nextIndex + 1;
      continue;
    }

    return nextCell;
  }

  return null;
};

export const getNextEmptyUpCell = (params: {
  fieldState: FieldState;
  cellRefs: CellRefs;
  currentFocusedCellPosition: CurrentFocusedCellPosition;
}): CellRef | null => {
  const { fieldState, cellRefs, currentFocusedCellPosition } = params;

  let nextRowIndex = currentFocusedCellPosition.rowIndex - 1;
  while (nextRowIndex >= 0) {
    const nextCell =
      cellRefs[nextRowIndex]?.[currentFocusedCellPosition.cellIndex];

    if (nextCell === undefined) {
      return null;
    }

    const isNextCellFilled = Boolean(
      fieldState[nextRowIndex][currentFocusedCellPosition.cellIndex]
    );
    if (isNextCellFilled) {
      nextRowIndex = nextRowIndex - 1;
      continue;
    }

    return nextCell;
  }

  return null;
};

export const getNextEmptyDownCell = (params: {
  fieldState: FieldState;
  cellRefs: CellRefs;
  currentFocusedCellPosition: CurrentFocusedCellPosition;
}): CellRef | null => {
  const { fieldState, cellRefs, currentFocusedCellPosition } = params;

  const columnLength = fieldState.length;

  let nextRowIndex = currentFocusedCellPosition.rowIndex + 1;
  while (nextRowIndex < columnLength) {
    const nextCell =
      cellRefs[nextRowIndex]?.[currentFocusedCellPosition.cellIndex];

    if (nextCell === undefined) {
      return null;
    }

    const isNextCellFilled = Boolean(
      fieldState[nextRowIndex][currentFocusedCellPosition.cellIndex]
    );
    if (isNextCellFilled) {
      nextRowIndex = nextRowIndex + 1;
      continue;
    }

    return nextCell;
  }

  return null;
};

export const getNextCellToFocusOnLeftMove = (params: {
  fieldState: FieldState;
  cellRefs: CellRefs;
  currentFocusedCellPosition: CurrentFocusedCellPosition;
}): CellRef | null => {
  const { fieldState, cellRefs, currentFocusedCellPosition } = params;

  for (
    let rowIndex = currentFocusedCellPosition.rowIndex;
    rowIndex >= 0;
    rowIndex--
  ) {
    const nextCell = getNextEmptyLeftCell({
      fieldState,
      cellRefs,
      currentFocusedCellPosition: {
        ...currentFocusedCellPosition,
        rowIndex,
      },
    });
    if (nextCell) return nextCell;
    currentFocusedCellPosition.cellIndex = fieldState[0].length;
  }

  return null;
};

export const getNextCellToFocusOnRightMove = (params: {
  fieldState: FieldState;
  cellRefs: CellRefs;
  currentFocusedCellPosition: CurrentFocusedCellPosition;
}): CellRef | null => {
  const { fieldState, cellRefs, currentFocusedCellPosition } = params;

  for (
    let rowIndex = currentFocusedCellPosition.rowIndex;
    rowIndex < fieldState.length;
    rowIndex++
  ) {
    const nextCell = getNextEmptyRightCell({
      fieldState,
      cellRefs,
      currentFocusedCellPosition: {
        ...currentFocusedCellPosition,
        rowIndex,
      },
    });
    if (nextCell) return nextCell;
    currentFocusedCellPosition.cellIndex = -1;
  }

  return null;
};

export const getNextCellToFocusOnUpMove = (params: {
  fieldState: FieldState;
  cellRefs: CellRefs;
  currentFocusedCellPosition: CurrentFocusedCellPosition;
}): CellRef | null => {
  const { fieldState, cellRefs, currentFocusedCellPosition } = params;

  for (
    let cellIndex = currentFocusedCellPosition.cellIndex;
    cellIndex >= 0;
    cellIndex--
  ) {
    const nextCell = getNextEmptyUpCell({
      fieldState,
      cellRefs,
      currentFocusedCellPosition: {
        ...currentFocusedCellPosition,
        cellIndex,
      },
    });
    if (nextCell) return nextCell;
    currentFocusedCellPosition.rowIndex = fieldState.length;
  }

  return null;
};

export const getNextCellToFocusOnDownMove = (params: {
  fieldState: FieldState;
  cellRefs: CellRefs;
  currentFocusedCellPosition: CurrentFocusedCellPosition;
}): CellRef | null => {
  const { fieldState, cellRefs, currentFocusedCellPosition } = params;

  for (
    let cellIndex = currentFocusedCellPosition.cellIndex;
    cellIndex < fieldState[0].length;
    cellIndex++
  ) {
    const nextCell = getNextEmptyDownCell({
      fieldState,
      cellRefs,
      currentFocusedCellPosition: {
        ...currentFocusedCellPosition,
        cellIndex,
      },
    });
    if (nextCell) return nextCell;
    currentFocusedCellPosition.rowIndex = -1;
  }

  return null;
};
