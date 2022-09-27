import { Dispatch, SetStateAction } from "react";

import { BaseRadioGroup, RadioGroupValue } from "src/components";
import { QuestionDifficulty } from "src/store";

type Props = {
  difficulty: RadioGroupValue<QuestionDifficulty>;
  setDifficulty: Dispatch<SetStateAction<RadioGroupValue<QuestionDifficulty>>>;
  difficulties: RadioGroupValue<QuestionDifficulty>[];
};

export function QuestionRadioGroup({
  difficulty,
  setDifficulty,
  difficulties,
}: Props) {
  return (
    <BaseRadioGroup
      value={difficulty}
      setValue={setDifficulty}
      values={difficulties}
    />
  );
}
