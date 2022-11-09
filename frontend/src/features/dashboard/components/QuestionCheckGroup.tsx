import { QuestionDifficulty } from "shared/api";
import { BaseCheckGroup, CheckGroupValue } from "src/components";

const difficultyMap: Record<
  QuestionDifficulty,
  CheckGroupValue<QuestionDifficulty>
> = {
  easy: {
    title: QuestionDifficulty.EASY,
    description:
      "Simple data structures and concepts such as arrays, strings, and linked lists",
  },
  medium: {
    title: QuestionDifficulty.MEDIUM,
    description:
      "Challenging data structures and concepts such as trees, graphs, and some dynamic programming",
  },
  hard: {
    title: QuestionDifficulty.HARD,
    description:
      "Complex data structures and concepts such as binary search, dynamic programming, and graph traversal",
  },
};

type Props = {
  selectedDifficulties: QuestionDifficulty[];
  updateSelectedValues: (difficulty: QuestionDifficulty) => void;
};

const QuestionCheckGroup = ({
  selectedDifficulties,
  updateSelectedValues,
}: Props) => {
  return (
    <BaseCheckGroup
      selectedValues={selectedDifficulties}
      updateSelectedValues={updateSelectedValues}
      values={Object.values(difficultyMap)}
    />
  );
};

export { QuestionCheckGroup };
