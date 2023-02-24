import React from "react";
import {
  ArrowKeysCodes,
  CellRef,
  CellRefs,
  CurrentFocusedCellPosition,
  FieldState,
  Marks,
  ScoresDict,
  WinnerCellsDict,
} from "@/features/game/types";
import { Field, FieldProps } from "@/features/game/components/Field/Field";
import {
  checkFieldHasEmptyCell,
  getFirstFocusableCell,
  getNextCellToFocusOnDownMove,
  getNextCellToFocusOnLeftMove,
  getNextCellToFocusOnRightMove,
  getNextCellToFocusOnUpMove,
  getWinner,
  getWinnerCellsDict,
} from "@/features/game/utils/helpers/helpers";
import css from "./Game.module.scss";
import { Winner } from "@/features/game/components/Winner/Winner";
import cn from "classnames";
import { Scores } from "../Scores/Scores";

const initialFieldState: FieldState = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
const initialWinnerCellsDict: WinnerCellsDict = {};
const initialCellRefs: CellRefs = {};
const initialCurrentMark: Marks = Marks.X;
const initialWinnerValue = null;
const initialScores: ScoresDict = { [Marks.X]: 0, [Marks.O]: 0 };

export const Game = () => {
  const [fieldState, setFieldState] = React.useState(initialFieldState);
  const [winner, setWinner] = React.useState<Marks | null>(initialWinnerValue);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [winnerCellsDict, setWinnerCellsDict] = React.useState<WinnerCellsDict>(
    initialWinnerCellsDict
  );
  const [scores, setScores] = React.useState(initialScores);

  const cellRefs = React.useRef<CellRefs>(initialCellRefs);
  const newGameButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const currentFocusedCellPositionRef =
    React.useRef<CurrentFocusedCellPosition | null>(null);
  const currentMarkRef = React.useRef<Marks>(initialCurrentMark);

  const setCellRef = React.useCallback(
    (params: { rowIndex: number; cellIndex: number; cellRef: CellRef }) => {
      const { rowIndex, cellIndex, cellRef } = params;
      cellRefs.current[rowIndex] = cellRefs.current[rowIndex] ?? {};
      const rowCellRefs = cellRefs.current[rowIndex];
      if (rowCellRefs) {
        rowCellRefs[cellIndex] = cellRef;
      }
    },
    []
  );

  const markCell = React.useCallback(
    (params: { rowIndex: number; cellIndex: number; mark: Marks }) => {
      const { rowIndex, cellIndex, mark } = params;

      setFieldState((prevFieldState) => {
        const nextFieldState = prevFieldState.map((prevRowState) => [
          ...prevRowState,
        ]);

        nextFieldState[rowIndex][cellIndex] = mark;

        return nextFieldState;
      });
    },
    []
  );

  const handleOnCellClick = React.useCallback<FieldProps["onCellClick"]>(
    (params) => {
      if (isGameOver) return;
      const mark = currentMarkRef.current;
      markCell({ ...params, mark: currentMarkRef.current });

      currentMarkRef.current = mark === Marks.X ? Marks.O : Marks.X;
    },
    [isGameOver, markCell]
  );

  const handleOnCellFocus = React.useCallback<FieldProps["onCellFocus"]>(
    (params) => {
      currentFocusedCellPositionRef.current = params;
    },
    []
  );

  const handleOnCellBlur = React.useCallback<FieldProps["onCellBlur"]>(() => {
    currentFocusedCellPositionRef.current = null;
  }, []);

  const handleOnResetScoreClick = React.useCallback(() => {
    setScores(initialScores);
  }, []);

  const startNewGame = React.useCallback(() => {
    setFieldState(initialFieldState);
    setWinner(initialWinnerValue);
    setIsGameOver(false);
    setWinnerCellsDict(initialWinnerCellsDict);
    currentMarkRef.current = initialCurrentMark;
    currentFocusedCellPositionRef.current = null;
  }, []);

  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (isGameOver) return;
      if (
        !(
          [
            ArrowKeysCodes.LEFT,
            ArrowKeysCodes.UP,
            ArrowKeysCodes.RIGHT,
            ArrowKeysCodes.DOWN,
          ] as string[]
        ).includes(event.code)
      )
        return;

      if (!currentFocusedCellPositionRef.current) {
        const isNextRightCellFilled = getFirstFocusableCell({
          fieldState,
          cellRefs: cellRefs.current,
        });
        return isNextRightCellFilled?.focus();
      }

      let nextCell: HTMLButtonElement | null = null;

      switch (event.code) {
        case ArrowKeysCodes.LEFT: {
          nextCell = getNextCellToFocusOnLeftMove({
            fieldState,
            cellRefs: cellRefs.current,
            currentFocusedCellPosition: {
              ...currentFocusedCellPositionRef.current,
            },
          });

          break;
        }
        case ArrowKeysCodes.RIGHT: {
          nextCell = getNextCellToFocusOnRightMove({
            fieldState,
            cellRefs: cellRefs.current,
            currentFocusedCellPosition: {
              ...currentFocusedCellPositionRef.current,
            },
          });

          break;
        }
        case ArrowKeysCodes.UP: {
          nextCell = getNextCellToFocusOnUpMove({
            fieldState,
            cellRefs: cellRefs.current,
            currentFocusedCellPosition: {
              ...currentFocusedCellPositionRef.current,
            },
          });

          break;
        }
        case ArrowKeysCodes.DOWN: {
          nextCell = getNextCellToFocusOnDownMove({
            fieldState,
            cellRefs: cellRefs.current,
            currentFocusedCellPosition: {
              ...currentFocusedCellPositionRef.current,
            },
          });

          break;
        }
      }

      if (nextCell) nextCell.focus();
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [fieldState, isGameOver]);

  React.useEffect(() => {
    const winnerCellsDict = getWinnerCellsDict(fieldState);
    if (winnerCellsDict !== null) setWinnerCellsDict(winnerCellsDict);

    const winner = winnerCellsDict
      ? getWinner(fieldState, winnerCellsDict)
      : null;
    if (winner !== null) {
      setWinner(winner);
      setScores((prevScores) => ({
        ...prevScores,
        [winner]: prevScores[winner] + 1,
      }));
    }

    const hasFieldEmptyCell = checkFieldHasEmptyCell(fieldState);
    if (winnerCellsDict !== null || !hasFieldEmptyCell) {
      setIsGameOver(true);
      newGameButtonRef.current?.focus();
    }
  }, [fieldState]);

  return (
    <div className={css.container}>
      <div className={css.topRow}>
        <button
          ref={newGameButtonRef}
          className={cn(css.button, css.newGameButton)}
          onClick={startNewGame}
        >
          New game
        </button>

        <button
          className={cn(css.button, css.resetScores)}
          onClick={handleOnResetScoreClick}
        >
          Reset scores
        </button>
      </div>

      <div className={css.fieldContainer}>
        <Field
          fieldState={fieldState}
          onCellClick={handleOnCellClick}
          winnerCellsDict={winnerCellsDict}
          setCellRef={setCellRef}
          onCellFocus={handleOnCellFocus}
          onCellBlur={handleOnCellBlur}
          isGameOver={isGameOver}
        />

        <div className={cn(css.gameOver, isGameOver && css.gameOver__visible)}>
          {isGameOver && <Winner winner={winner} />}
        </div>
      </div>

      <Scores scores={scores} />
    </div>
  );
};
