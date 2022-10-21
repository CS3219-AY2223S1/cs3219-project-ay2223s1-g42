import { MatchType } from "shared/api";
import {
  BaseRadioGroup,
  CheckGroupValue,
  RadioGroupValue,
} from "src/components";

type Props = {
  type: RadioGroupValue<MatchType>;
  setType: (value: RadioGroupValue<MatchType>) => void;
  types: RadioGroupValue<MatchType>[];
};

const MatchTypeRadioGroup = ({ type, setType, types }: Props) => {
  return <BaseRadioGroup value={type} setValue={setType} values={types} />;
};

const matchTypeMap: Record<MatchType, RadioGroupValue<MatchType>> = {
  Difficulty: {
    title: "Difficulty",
    description: "Match based on difficulty (easy, medium or hard)",
  },
  Topics: {
    title: "Topics",
    description:
      "Match based on question's topic eg Array, Linked List, Stacks",
  },
  "Question Of The Day": {
    title: "Question Of The Day",
    description: "Match based on the question of the day",
  },
};

export { MatchTypeRadioGroup, matchTypeMap };
