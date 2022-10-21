import { MatchType } from "shared/api";
import { BaseRadioGroup, RadioGroupValue } from "src/components";

type Props = {
  selectedType: RadioGroupValue<MatchType>;
  setType: (value: RadioGroupValue<MatchType>) => void;
  types: RadioGroupValue<MatchType>[];
};

const MatchTypeRadioGroup = ({ selectedType, setType, types }: Props) => {
  return (
    <BaseRadioGroup value={selectedType} setValue={setType} values={types} />
  );
};

export { MatchTypeRadioGroup };
