import { BaseRadioGroup, RadioGroupValue } from "src/components";
import { QuestionDifficulty } from "src/store";

type Props = {
  difficulty: RadioGroupValue<QuestionDifficulty>;
  setDifficulty: (value: RadioGroupValue<QuestionDifficulty>) => void;
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
