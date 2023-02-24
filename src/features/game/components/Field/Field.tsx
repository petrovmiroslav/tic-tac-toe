import React from "react";
import { FieldState } from "@/features/game/types";
import {
  FieldRow,
  FieldRowProps,
} from "@/features/game/components/FieldRow/FieldRow";
import css from "./Field.module.scss";

export type FieldProps = {
  fieldState: FieldState;
} & Pick<
  FieldRowProps,
  | "winnerCellsDict"
  | "onCellClick"
  | "onCellFocus"
  | "onCellBlur"
  | "setCellRef"
  | "isGameOver"
>;
export const Field = (props: FieldProps) => {
  const { fieldState, ...restFieldRowProps } = props;

  return (
    <div className={css.field}>
      {fieldState.map((fieldRowState, fieldRowIndex) => (
        <FieldRow
          key={fieldRowIndex}
          fieldRowState={fieldRowState}
          rowIndex={fieldRowIndex}
          {...restFieldRowProps}
        />
      ))}
    </div>
  );
};
