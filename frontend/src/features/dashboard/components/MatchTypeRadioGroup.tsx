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

export { MatchTypeRadioGroup };
