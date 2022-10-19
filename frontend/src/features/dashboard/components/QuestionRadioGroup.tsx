import { QuestionDifficulty } from "shared/api";
import { BaseRadioGroup, RadioGroupValue } from "src/components";

type Props = {
  difficulty: RadioGroupValue<QuestionDifficulty>;
  setDifficulty: (value: RadioGroupValue<QuestionDifficulty>) => void;
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
      setValue={setDifficulty}
      values={difficulties}
    />
  );
};

export { QuestionRadioGroup };
