import { QuestionDifficulty } from "shared/api";
import { BaseRadioGroup, RadioGroupValue } from "src/components";

type Props = {
  difficulty: QuestionDifficulty;
  setDifficulty: (value: QuestionDifficulty) => void;
  difficulties: RadioGroupValue<QuestionDifficulty>[];
};

const QuestionRadioGroup = ({
  difficulty,
  setDifficulty,
  difficulties,
}: Props) => {
  return (
    <BaseRadioGroup
      value={difficulty}
      updateValue={setDifficulty}
      values={difficulties}
    />
  );
};

export { QuestionRadioGroup };
