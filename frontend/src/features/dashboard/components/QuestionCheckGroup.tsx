import { BaseCheckGroup, CheckGroupValue } from "src/components";
import { QuestionDifficulty } from "shared/api";

type Props = {
  selectedDifficulties: QuestionDifficulty[];
  updateSelectedValues: (difficulty: QuestionDifficulty) => void;
  difficulties: CheckGroupValue<QuestionDifficulty>[];
};

const QuestionCheckGroup = ({
  selectedDifficulties,
  updateSelectedValues,
  difficulties,
}: Props) => {
  return (
    <BaseCheckGroup
      selectedValues={selectedDifficulties}
      updateSelectedValues={updateSelectedValues}
      values={difficulties}
    />
  );
};

export { QuestionCheckGroup };
