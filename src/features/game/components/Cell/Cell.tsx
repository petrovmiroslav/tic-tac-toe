import React from "react";
import { CellRef, CellState } from "@/features/game/types";
import css from "./Cell.module.scss";
import cn from "classnames";

export type CellProps = {
  cellState: CellState;
  rowIndex: number;
  cellIndex: number;
  onClick: (params: { rowIndex: number; cellIndex: number }) => void;
  onFocus: (params: { rowIndex: number; cellIndex: number }) => void;
  onBlur: () => void;
  setCellRef: (params: {
    rowIndex: number;
    cellIndex: number;
    cellRef: CellRef;
  }) => void;
  isWinnerCell: boolean;
  isGameOver: boolean;
};

export const Cell = (props: CellProps) => {
  const {
    cellState,
    rowIndex,
    cellIndex,
    onClick,
    isWinnerCell,
    setCellRef,
    onFocus,
    onBlur,
    isGameOver,
  } = props;

  const isCellFilled = cellState !== null;
  const isCellDisabled = isGameOver || isCellFilled;

  const handleOnClick = React.useCallback(() => {
    onClick({ rowIndex, cellIndex });
  }, [cellIndex, onClick, rowIndex]);

  const handleSetRef = React.useCallback(
    (el: CellRef) => setCellRef({ rowIndex, cellIndex, cellRef: el }),
    [cellIndex, rowIndex, setCellRef]
  );

  const handleOnFocus = React.useCallback(
    () => onFocus({ rowIndex, cellIndex }),
    [cellIndex, onFocus, rowIndex]
  );

  return (
    <button
      ref={handleSetRef}
      className={cn(css.cell, isWinnerCell && css.cell__winner)}
      onClick={handleOnClick}
      onFocus={handleOnFocus}
      onBlur={onBlur}
      disabled={isCellDisabled}
    >
      <span className={cn(css.content)}>{cellState}</span>
    </button>
  );
};
