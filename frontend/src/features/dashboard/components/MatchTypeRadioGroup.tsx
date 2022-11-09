import { MatchType } from "shared/api";
import { BaseRadioGroup, RadioGroupValue } from "src/components";

const matchTypeMap: Record<MatchType, RadioGroupValue<MatchType>> = {
  difficulty: {
    title: MatchType.DIFFICULTY,
    description: "Match based on difficulty (easy, medium or hard)",
  },
  topics: {
    title: MatchType.TOPICS,
    description:
      "Match based on question's topic eg Array, Linked List, Stacks",
  },
  qotd: {
    title: MatchType.QOTD,
    description: "Match based on the question of the day",
  },
};

type Props = {
  type?: MatchType;
  setType: (value: MatchType) => void;
};

const MatchTypeRadioGroup = ({ type, setType }: Props) => {
  return (
    <BaseRadioGroup
      value={type}
      updateValue={setType}
      values={Object.values(matchTypeMap)}
    />
  );
};

export { MatchTypeRadioGroup };
