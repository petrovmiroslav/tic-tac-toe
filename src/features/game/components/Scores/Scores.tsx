import { Marks, ScoresDict } from "../../types";
import css from "./Scores.module.scss";

type ScoresProps = {
  scores: ScoresDict;
};

export const Scores = (props: ScoresProps) => {
  const { scores } = props;

  return (
    <div className={css.container}>
      <span>
        {Marks.X}:<span className={css.score}>{scores[Marks.X]}</span>
      </span>{" "}
      <span>
        {Marks.O}:<span className={css.score}>{scores[Marks.O]}</span>
      </span>
    </div>
  );
};
