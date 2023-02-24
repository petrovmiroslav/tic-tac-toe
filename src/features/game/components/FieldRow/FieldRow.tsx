import { FieldRowState, WinnerCellsDict } from "@/features/game/types";
import { Cell, CellProps } from "@/features/game/components/Cell/Cell";
import React from "react";

export type FieldRowProps = {
  fieldRowState: FieldRowState;
  winnerCellsDict: WinnerCellsDict;
  rowIndex: number;
  onCellClick: CellProps["onClick"];
  onCellFocus: CellProps["onFocus"];
  onCellBlur: CellProps["onBlur"];
  setCellRef: CellProps["setCellRef"];
  isGameOver: CellProps["isGameOver"];
};

export const FieldRow = (props: FieldRowProps) => {
  const {
    fieldRowState,
    rowIndex,
    winnerCellsDict,
    onCellClick,
    onCellFocus,
    onCellBlur,
    ...restCellProps
  } = props;

  return (
    <>
      {fieldRowState.map((cellState, cellIndex) => (
        <Cell
          key={cellIndex}
          cellState={cellState}
          rowIndex={rowIndex}
          cellIndex={cellIndex}
          isWinnerCell={Boolean(winnerCellsDict[rowIndex]?.[cellIndex])}
          onClick={onCellClick}
          onFocus={onCellFocus}
          onBlur={onCellBlur}
          {...restCellProps}
        />
      ))}
    </>
  );
};
