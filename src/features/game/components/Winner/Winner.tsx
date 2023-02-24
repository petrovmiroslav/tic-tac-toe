import { Marks } from "@/features/game/types";
import css from "./Winner.module.scss";

type WinnerProps = {
  winner: Marks | null;
};

export const Winner = (props: WinnerProps) => {
  const { winner } = props;
  const isTie = winner === null;

  return (
    <div className={css.container}>
      <span className={css.winnerMark}>
        {isTie ? `${Marks.X} ${Marks.O}` : winner}
      </span>

      {isTie ? "tie" : "has won"}
    </div>
  );
};
